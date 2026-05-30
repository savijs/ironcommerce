const crypto = require("crypto");
const supabaseAdmin = require("../supabase-admin");

const BUCKET = "story-videos";

const MIME_EXTENSION = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const ALLOWED_MIMES = Object.keys(MIME_EXTENSION);

function validateVideoFile(file) {
  if (!file) return;

  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    throw new Error("Formato não permitido. Use .mp4, .webm ou .mov");
  }
}

async function uploadStoryVideo(file, storeId) {
  validateVideoFile(file);

  const extension = MIME_EXTENSION[file.mimetype];
  const path = `${storeId}/${crypto.randomUUID()}${extension}`;

  console.log(`[IRON] Upload iniciado — loja ${storeId} — ${file.originalname}`);

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    throw new Error(`Erro ao enviar vídeo: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

  console.log(`[IRON] Vídeo salvo — ${BUCKET}/${path}`);

  return data.publicUrl;
}

module.exports = {
  BUCKET,
  ALLOWED_MIMES,
  uploadStoryVideo,
};
