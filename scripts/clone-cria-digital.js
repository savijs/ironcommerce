const fs = require('fs/promises');
const path = require('path');

const START_URL = 'https://cria.digital/';
const OUT_DIR = path.resolve('public', 'cria-digital-clone');
const ASSET_ROOT = path.join(OUT_DIR, 'assets');

const downloaded = new Map();
const cssFiles = new Set();

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

function sanitizeSegment(seg) {
  return seg.replace(/[<>:"\\|?*\x00-\x1F]/g, '_');
}

function localPathForUrl(u) {
  const host = sanitizeSegment(u.hostname || 'site');
  const rawPath = u.pathname && u.pathname !== '/' ? u.pathname : '/index';
  const parts = rawPath.split('/').filter(Boolean).map(sanitizeSegment);
  let fileName = parts.length ? parts.pop() : 'index';

  if (!fileName.includes('.')) fileName += '.html';

  if (u.search) {
    const q = Buffer.from(u.search).toString('base64url').slice(0, 16);
    const ext = path.extname(fileName);
    const base = ext ? fileName.slice(0, -ext.length) : fileName;
    fileName = `${base}__q_${q}${ext || '.bin'}`;
  }

  return path.join(ASSET_ROOT, host, ...parts, fileName);
}

function toPosix(p) { return p.split(path.sep).join('/'); }

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ct = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, contentType: ct };
}

function shouldDownloadUrl(v) {
  if (!v) return false;
  const t = v.trim();
  if (!t) return false;
  if (t.startsWith('data:') || t.startsWith('javascript:') || t.startsWith('mailto:') || t.startsWith('tel:') || t.startsWith('#')) return false;
  return true;
}

async function downloadAsset(absUrl) {
  if (downloaded.has(absUrl)) return downloaded.get(absUrl);

  const u = new URL(absUrl);
  const targetPath = localPathForUrl(u);
  const targetDir = path.dirname(targetPath);
  await ensureDir(targetDir);

  try {
    const { buf, contentType } = await fetchBuffer(absUrl);
    await fs.writeFile(targetPath, buf);
    const rel = toPosix(path.relative(OUT_DIR, targetPath));
    downloaded.set(absUrl, rel);
    if ((contentType || '').includes('text/css') || rel.endsWith('.css')) cssFiles.add(targetPath);
    return rel;
  } catch (e) {
    downloaded.set(absUrl, null);
    return null;
  }
}

async function rewriteHtml(html, baseUrl) {
  const attrRegex = /(src|href|poster)=(["'])([^"']+)\2/gi;
  let out = html;
  const matches = [...html.matchAll(attrRegex)];

  for (const m of matches) {
    const full = m[0];
    const attr = m[1];
    const quote = m[2];
    const val = m[3];
    if (!shouldDownloadUrl(val)) continue;

    let abs;
    try { abs = new URL(val, baseUrl).toString(); } catch { continue; }

    const rel = await downloadAsset(abs);
    if (!rel) continue;
    const replaced = `${attr}=${quote}${rel}${quote}`;
    out = out.replace(full, replaced);
  }

  const srcsetRegex = /srcset=(["'])([^"']+)\1/gi;
  const srcsetMatches = [...out.matchAll(srcsetRegex)];
  for (const m of srcsetMatches) {
    const full = m[0];
    const quote = m[1];
    const val = m[2];
    const entries = val.split(',').map(s => s.trim()).filter(Boolean);
    const rewritten = [];
    for (const e of entries) {
      const parts = e.split(/\s+/);
      const uPart = parts[0];
      if (!shouldDownloadUrl(uPart)) { rewritten.push(e); continue; }
      let abs;
      try { abs = new URL(uPart, baseUrl).toString(); } catch { rewritten.push(e); continue; }
      const rel = await downloadAsset(abs);
      rewritten.push(rel ? [rel, ...parts.slice(1)].join(' ') : e);
    }
    out = out.replace(full, `srcset=${quote}${rewritten.join(', ')}${quote}`);
  }

  const inlineCssRegex = /url\(([^)]+)\)/gi;
  const cssMatches = [...out.matchAll(inlineCssRegex)];
  for (const m of cssMatches) {
    const raw = m[1].trim().replace(/^['"]|['"]$/g, '');
    if (!shouldDownloadUrl(raw)) continue;
    let abs;
    try { abs = new URL(raw, baseUrl).toString(); } catch { continue; }
    const rel = await downloadAsset(abs);
    if (rel) out = out.replace(m[0], `url('${rel}')`);
  }

  return out;
}

async function rewriteCssFile(cssPath, cssOriginalUrl) {
  let css = await fs.readFile(cssPath, 'utf8');
  const regex = /url\(([^)]+)\)/gi;
  const matches = [...css.matchAll(regex)];
  for (const m of matches) {
    const raw = m[1].trim().replace(/^['"]|['"]$/g, '');
    if (!shouldDownloadUrl(raw)) continue;
    let abs;
    try { abs = new URL(raw, cssOriginalUrl).toString(); } catch { continue; }
    const relAsset = await downloadAsset(abs);
    if (!relAsset) continue;

    const absCss = path.resolve(cssPath);
    const targetAssetAbs = path.resolve(OUT_DIR, relAsset);
    const relFromCss = toPosix(path.relative(path.dirname(absCss), targetAssetAbs));
    css = css.replace(m[0], `url('${relFromCss}')`);
  }
  await fs.writeFile(cssPath, css, 'utf8');
}

async function main() {
  await ensureDir(OUT_DIR);
  const { buf } = await fetchBuffer(START_URL);
  const html = buf.toString('utf8');
  const rewritten = await rewriteHtml(html, START_URL);

  const indexPath = path.join(OUT_DIR, 'index.html');
  await fs.writeFile(indexPath, rewritten, 'utf8');

  for (const [url, rel] of downloaded.entries()) {
    if (!rel) continue;
    const absPath = path.resolve(OUT_DIR, rel);
    if (!cssFiles.has(absPath)) continue;
    await rewriteCssFile(absPath, url);
  }

  const manifest = {
    startUrl: START_URL,
    outputDir: OUT_DIR,
    downloadedCount: [...downloaded.values()].filter(Boolean).length,
    failedCount: [...downloaded.values()].filter(v => v === null).length,
    generatedAt: new Date().toISOString(),
    files: ['index.html', ...[...downloaded.values()].filter(Boolean).sort()]
  };

  await fs.writeFile(path.join(OUT_DIR, 'clone-manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`Clone concluído em: ${OUT_DIR}`);
  console.log(`Assets baixados: ${manifest.downloadedCount}`);
  console.log(`Assets com falha: ${manifest.failedCount}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
