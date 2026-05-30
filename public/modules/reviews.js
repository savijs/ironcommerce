(function () {
  const MODULE = "reviews";
  const SECTION_CLASS = "iron-reviews-section";
  const STYLE_ID = "iron-reviews-style";

  function activate() {
    if (document.querySelector(`.${SECTION_CLASS}`)) return;

    if (!document.querySelector(`#${STYLE_ID}`)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.innerHTML = `
        .${SECTION_CLASS} {
          max-width: 1180px;
          margin: 20px auto;
          padding: 16px;
          font-family: Arial, sans-serif;
          text-align: center;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,.08);
        }

        .iron-reviews-title {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 800;
        }

        .iron-reviews-text {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
      `;
      document.head.appendChild(style);
    }

    const section = document.createElement("section");
    section.className = SECTION_CLASS;
    section.innerHTML = `
      <h2 class="iron-reviews-title">⭐ Reviews Iron Commerce</h2>
      <p class="iron-reviews-text">Módulo de avaliações ativo — em breve conteúdo dinâmico.</p>
    `;

    const main = document.querySelector("main") || document.body;
    main.appendChild(section);
  }

  function deactivate() {
    document.querySelector(`.${SECTION_CLASS}`)?.remove();
    document.querySelector(`#${STYLE_ID}`)?.remove();
  }

  window.IronModules = window.IronModules || {};
  window.IronModules[MODULE] = { activate, deactivate };
})();
