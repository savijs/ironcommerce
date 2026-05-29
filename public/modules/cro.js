(function () {
    console.log("⚡ Iron CRO ativo");
  
    if (document.querySelector(".iron-cro-bar")) return;
  
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="iron-cro-bar">
        🔥 Experiência premium ativada pela Iron Commerce
      </div>
      `
    );
  
    const style = document.createElement("style");
    style.innerHTML = `
      .iron-cro-bar {
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
  })();