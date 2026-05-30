(function () {
  const MODULE = "stories";
  const IRON_BASE_URL = "https://ironcommerce.onrender.com";
  const SECTION_CLASS = "iron-stories-section";
  const STYLE_ID = "iron-stories-style";

  function getStoreId() {
    const loader = [...document.scripts].find((script) =>
      script.src.includes("iron-loader.js")
    );

    if (!loader) return null;

    const url = new URL(loader.src);
    return url.searchParams.get("store");
  }

  async function fetchStories(storeId) {
    const response = await fetch(`${IRON_BASE_URL}/stories/${storeId}`, {
      cache: "no-store",
    });

    return response.json();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderStoryCard(story) {
    const href = story.link_url || "#";
    const title = escapeHtml(story.title);

    if (story.media_url) {
      console.log(`[IRON] Story renderizado com vídeo — ${story.title}`);

      return `
        <a class="iron-story iron-story--video" href="${href}">
          <video
            src="${story.media_url}"
            autoplay
            muted
            loop
            playsinline
          ></video>
          <span class="iron-story-label">${title}</span>
        </a>
      `;
    }

    console.log(`[IRON] Story renderizado sem vídeo (fallback) — ${story.title}`);

    return `
      <a class="iron-story" href="${href}">
        ${title}
      </a>
    `;
  }

  function renderStories(stories) {
    if (document.querySelector(`.${SECTION_CLASS}`)) return;

    if (!document.querySelector(`#${STYLE_ID}`)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.innerHTML = `
        .${SECTION_CLASS} {
          max-width: 1180px;
          margin: 28px auto;
          padding: 0 16px;
          font-family: Arial, sans-serif;
        }

        .iron-stories-title {
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 16px;
          letter-spacing: -0.04em;
          text-align: center;
        }

        .iron-stories-track {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 12px;
        }

        .iron-story {
          flex: 0 0 160px;
          aspect-ratio: 9 / 16;
          background: linear-gradient(135deg, #111, #444);
          border-radius: 22px;
          color: #fff;
          display: flex;
          align-items: end;
          padding: 14px;
          font-weight: 800;
          box-shadow: 0 14px 40px rgba(0,0,0,.18);
          text-decoration: none;
        }

        .iron-story--video {
          position: relative;
          overflow: hidden;
          padding: 0;
        }

        .iron-story--video video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 22px;
        }

        .iron-story-label {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          padding: 14px;
          background: linear-gradient(to top, rgba(0,0,0,.75), transparent);
        }

        @media(max-width: 768px) {
          .iron-story {
            flex-basis: 42%;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const section = document.createElement("section");
    section.className = SECTION_CLASS;

    section.innerHTML = `
      <h2 class="iron-stories-title">Stories Iron Commerce</h2>
      <div class="iron-stories-track">
        ${stories.map((story) => renderStoryCard(story)).join("")}
      </div>
    `;

    const main = document.querySelector("main") || document.body;
    main.insertBefore(section, main.firstChild);
  }

  async function activate() {
    const storeId = getStoreId();

    if (!storeId) return;

    const data = await fetchStories(storeId);

    if (!data.success || !data.stories.length) return;

    renderStories(data.stories);
  }

  function deactivate() {
    document.querySelector(`.${SECTION_CLASS}`)?.remove();
    document.querySelector(`#${STYLE_ID}`)?.remove();
  }

  window.IronModules = window.IronModules || {};
  window.IronModules[MODULE] = { activate, deactivate };
})();
