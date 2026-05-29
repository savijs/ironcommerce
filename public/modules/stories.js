(function () {
    console.log("🎬 Iron Stories ativo");
  
    if (document.querySelector(".iron-stories-section")) return;
  
    const style = document.createElement("style");
    style.innerHTML = `
      .iron-stories-section {
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
      }
  
      @media(max-width: 768px) {
        .iron-story {
          flex-basis: 42%;
        }
      }
    `;
    document.head.appendChild(style);
  
    const section = document.createElement("section");
    section.className = "iron-stories-section";
  
    section.innerHTML = `
      <h2 class="iron-stories-title">Stories Iron Commerce</h2>
      <div class="iron-stories-track">
        <div class="iron-story">Nova coleção</div>
        <div class="iron-story">Mais vendidos</div>
        <div class="iron-story">Prova social</div>
        <div class="iron-story">Oferta especial</div>
      </div>
    `;
  
    const main = document.querySelector("main") || document.body;
    main.insertBefore(section, main.firstChild);
  })();