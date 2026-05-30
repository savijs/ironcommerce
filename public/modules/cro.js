(function () {
  const MODULE = "cro";
  const BAR_CLASS = "iron-cro-bar";
  const STYLE_ID = "iron-cro-style";

  function activate() {
    if (document.querySelector(`.${BAR_CLASS}`)) return;

    document.body.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="${BAR_CLASS}">
        🔥 Experiência premium ativada pela Iron Commerce
      </div>
      `
    );

    if (document.querySelector(`#${STYLE_ID}`)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      .${BAR_CLASS} {
        width: 100%;
        background: #111;
        color: #fff;
        text-align: center;
        padding: 12px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: 800;
        z-index: 99999999;
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }

  function deactivate() {
    document.querySelector(`.${BAR_CLASS}`)?.remove();
    document.querySelector(`#${STYLE_ID}`)?.remove();
  }

  window.IronModules = window.IronModules || {};
  window.IronModules[MODULE] = { activate, deactivate };
})();
