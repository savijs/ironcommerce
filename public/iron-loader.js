(function () {
    console.log("🔥 Iron Commerce Theme Engine carregado");
  
    if (document.querySelector("#iron-theme-engine")) return;
  
    const style = document.createElement("style");
    style.id = "iron-theme-engine";
  
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  
      :root {
        --iron-bg: #faf7f2;
        --iron-dark: #111111;
        --iron-muted: #6f6a64;
        --iron-card: #ffffff;
        --iron-border: rgba(17,17,17,.08);
        --iron-shadow: 0 18px 50px rgba(0,0,0,.10);
        --iron-radius: 22px;
      }
  
      body {
        font-family: 'Manrope', Arial, sans-serif !important;
        background: var(--iron-bg) !important;
        color: var(--iron-dark) !important;
      }
  
      h1, h2, h3, h4,
      .h1, .h2, .h3,
      .section-title,
      .title,
      .js-product-name {
        font-family: 'Manrope', Arial, sans-serif !important;
        letter-spacing: -0.04em !important;
        color: var(--iron-dark) !important;
        font-weight: 800 !important;
      }
  
      a, button, input, select, textarea {
        font-family: 'Manrope', Arial, sans-serif !important;
      }
  
      .js-header,
      header,
      .site-header {
        backdrop-filter: blur(18px) !important;
        background: rgba(250,247,242,.82) !important;
        border-bottom: 1px solid var(--iron-border) !important;
        box-shadow: 0 10px 30px rgba(0,0,0,.04) !important;
      }
  
      .iron-premium-bar {
        width: 100%;
        background: #111;
        color: #fff;
        text-align: center;
        padding: 10px 14px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .02em;
        z-index: 999999;
        position: relative;
      }
  
      .container,
      .section,
      main section {
        transition: all .35s ease !important;
      }
  
      img {
        transition: transform .45s ease, filter .45s ease !important;
      }
  
      .item,
      .product-item,
      .js-item-product,
      .product-card,
      [data-store*="product-item"] {
        background: var(--iron-card) !important;
        border: 1px solid var(--iron-border) !important;
        border-radius: var(--iron-radius) !important;
        overflow: hidden !important;
        box-shadow: 0 8px 28px rgba(0,0,0,.06) !important;
        padding: 12px !important;
        transition: transform .35s ease, box-shadow .35s ease, border .35s ease !important;
      }
  
      .item:hover,
      .product-item:hover,
      .js-item-product:hover,
      .product-card:hover,
      [data-store*="product-item"]:hover {
        transform: translateY(-6px) !important;
        box-shadow: var(--iron-shadow) !important;
        border-color: rgba(17,17,17,.18) !important;
      }
  
      .item:hover img,
      .product-item:hover img,
      .js-item-product:hover img,
      .product-card:hover img,
      [data-store*="product-item"]:hover img {
        transform: scale(1.045) !important;
        filter: contrast(1.03) saturate(1.02) !important;
      }
  
      .price,
      .js-price-display,
      .item-price,
      .product-price {
        font-weight: 800 !important;
        color: #111 !important;
        font-size: 16px !important;
      }
  
      .btn,
      .button,
      button[type="submit"],
      .js-addtocart,
      .js-product-submit,
      input[type="submit"] {
        border-radius: 999px !important;
        background: #111 !important;
        color: #fff !important;
        border: 0 !important;
        font-weight: 800 !important;
        box-shadow: 0 12px 30px rgba(0,0,0,.16) !important;
        transition: transform .25s ease, box-shadow .25s ease !important;
      }
  
      .btn:hover,
      .button:hover,
      button[type="submit"]:hover,
      .js-addtocart:hover,
      .js-product-submit:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 18px 44px rgba(0,0,0,.22) !important;
      }
  
      .iron-hero-upgrade {
        margin: 18px auto 28px;
        width: min(1180px, calc(100% - 28px));
        border-radius: 32px;
        background:
          radial-gradient(circle at top left, rgba(255,255,255,.38), transparent 34%),
          linear-gradient(135deg, #111, #2d2924 52%, #b89467);
        color: #fff;
        padding: 54px 34px;
        box-shadow: 0 26px 80px rgba(0,0,0,.22);
        position: relative;
        overflow: hidden;
      }
  
      .iron-hero-upgrade:after {
        content: "";
        position: absolute;
        width: 340px;
        height: 340px;
        border-radius: 50%;
        right: -120px;
        top: -120px;
        background: rgba(255,255,255,.13);
        filter: blur(2px);
      }
  
      .iron-hero-kicker {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .18em;
        opacity: .78;
        font-weight: 800;
        margin-bottom: 14px;
      }
  
      .iron-hero-title {
        font-size: clamp(34px, 6vw, 76px);
        line-height: .92;
        letter-spacing: -.07em;
        font-weight: 900;
        max-width: 720px;
        margin: 0 0 18px;
      }
  
      .iron-hero-subtitle {
        max-width: 580px;
        font-size: 17px;
        line-height: 1.55;
        opacity: .86;
        margin-bottom: 26px;
      }
  
      .iron-hero-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
  
      .iron-hero-btn {
        border-radius: 999px;
        padding: 14px 20px;
        border: 1px solid rgba(255,255,255,.22);
        background: #fff;
        color: #111;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 12px 34px rgba(0,0,0,.18);
      }
  
      .iron-hero-btn.secondary {
        background: rgba(255,255,255,.12);
        color: #fff;
        backdrop-filter: blur(12px);
      }
  
      .iron-trust-strip {
        width: min(1180px, calc(100% - 28px));
        margin: 0 auto 28px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
  
      .iron-trust-card {
        background: rgba(255,255,255,.78);
        border: 1px solid var(--iron-border);
        border-radius: 22px;
        padding: 18px;
        box-shadow: 0 10px 30px rgba(0,0,0,.05);
      }
  
      .iron-trust-card strong {
        display: block;
        font-size: 15px;
        font-weight: 900;
        margin-bottom: 4px;
      }
  
      .iron-trust-card span {
        font-size: 13px;
        color: var(--iron-muted);
        line-height: 1.4;
      }
  
      .iron-floating-cro {
        position: fixed;
        right: 22px;
        bottom: 22px;
        z-index: 99999999;
        width: 310px;
        background: rgba(255,255,255,.92);
        backdrop-filter: blur(18px);
        border: 1px solid rgba(0,0,0,.08);
        border-radius: 24px;
        padding: 18px;
        box-shadow: 0 24px 70px rgba(0,0,0,.22);
        animation: ironUp .45s ease both;
      }
  
      .iron-floating-cro h3 {
        margin: 0 0 6px;
        font-size: 17px;
        font-weight: 900;
        letter-spacing: -.04em;
      }
  
      .iron-floating-cro p {
        margin: 0 0 14px;
        color: #666;
        font-size: 13px;
        line-height: 1.45;
      }
  
      .iron-floating-cro button {
        width: 100%;
        background: #111;
        color: #fff;
        border: 0;
        border-radius: 999px;
        padding: 12px;
        font-weight: 900;
        cursor: pointer;
      }
  
      .iron-badge {
        position: fixed;
        left: 22px;
        bottom: 22px;
        z-index: 99999999;
        background: #fff;
        border-radius: 999px;
        padding: 12px 16px;
        box-shadow: 0 18px 50px rgba(0,0,0,.18);
        display: flex;
        gap: 10px;
        align-items: center;
        font-size: 13px;
        font-weight: 800;
        border: 1px solid var(--iron-border);
      }
  
      .iron-badge-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #16a34a;
        box-shadow: 0 0 0 6px rgba(22,163,74,.12);
      }
  
      @keyframes ironUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
  
      @media(max-width: 768px) {
        .iron-hero-upgrade {
          padding: 38px 22px;
          border-radius: 24px;
          margin-top: 12px;
        }
  
        .iron-trust-strip {
          grid-template-columns: 1fr;
        }
  
        .iron-floating-cro {
          width: calc(100vw - 28px);
          right: 14px;
          bottom: 14px;
        }
  
        .iron-badge {
          left: 14px;
          bottom: 150px;
          max-width: calc(100vw - 28px);
        }
  
        .item,
        .product-item,
        .js-item-product,
        .product-card,
        [data-store*="product-item"] {
          border-radius: 18px !important;
        }
      }
    `;
  
    document.head.appendChild(style);
  
    function addPremiumBar() {
      if (document.querySelector(".iron-premium-bar")) return;
  
      document.body.insertAdjacentHTML(
        "afterbegin",
        `<div class="iron-premium-bar">✨ Loja com experiência premium ativada pela Iron Commerce</div>`
      );
    }
  
    function addHero() {
      if (document.querySelector(".iron-hero-upgrade")) return;
  
      const main = document.querySelector("main") || document.body;
  
      const hero = document.createElement("section");
      hero.className = "iron-hero-upgrade";
      hero.innerHTML = `
        <div class="iron-hero-kicker">Iron Commerce Experience</div>
        <h1 class="iron-hero-title">Uma vitrine mais premium, rápida e feita para vender.</h1>
        <p class="iron-hero-subtitle">
          Esta camada foi inserida por um app externo, sem editar manualmente o tema.
          É assim que módulos de CRO, stories, prova social e experiências visuais podem entrar na loja.
        </p>
        <div class="iron-hero-actions">
          <button class="iron-hero-btn" data-iron-scroll>Explorar produtos</button>
          <button class="iron-hero-btn secondary" data-iron-info>Ver tecnologia</button>
        </div>
      `;
  
      main.insertBefore(hero, main.firstChild);
    }
  
    function addTrustStrip() {
      if (document.querySelector(".iron-trust-strip")) return;
  
      const hero = document.querySelector(".iron-hero-upgrade");
      if (!hero) return;
  
      hero.insertAdjacentHTML(
        "afterend",
        `
        <div class="iron-trust-strip">
          <div class="iron-trust-card">
            <strong>⚡ Performance visual</strong>
            <span>Componentes leves carregados por script externo.</span>
          </div>
          <div class="iron-trust-card">
            <strong>🛍️ Conversão</strong>
            <span>Camadas de prova social, CTA e experiência mobile.</span>
          </div>
          <div class="iron-trust-card">
            <strong>✨ Premium UX</strong>
            <span>Estilo moderno aplicado por cima do tema atual.</span>
          </div>
        </div>
        `
      );
    }
  
    function addFloatingCRO() {
      if (document.querySelector(".iron-floating-cro")) return;
  
      document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="iron-floating-cro">
          <h3>🔥 Upgrade ativo</h3>
          <p>
            Cards, botões, títulos, vitrine e efeitos foram otimizados pelo Iron Loader.
          </p>
          <button data-iron-scroll>Ver produtos</button>
        </div>
  
        <div class="iron-badge">
          <div class="iron-badge-dot"></div>
          <span>18 clientes navegando agora</span>
        </div>
        `
      );
    }
  
    function bindActions() {
      document.querySelectorAll("[data-iron-scroll]").forEach((button) => {
        button.addEventListener("click", () => {
          const target =
            document.querySelector(".js-product-table") ||
            document.querySelector(".products") ||
            document.querySelector("[data-store='category-grid']") ||
            document.querySelector("[data-store*='product']") ||
            document.querySelector("main");
  
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
  
      document.querySelectorAll("[data-iron-info]").forEach((button) => {
        button.addEventListener("click", () => {
          alert("Iron Loader: uma camada externa capaz de adicionar apps, CRO e visual premium na Nuvemshop.");
        });
      });
    }
  
    function rotateProof() {
      const texts = [
        "18 clientes navegando agora",
        "Uma pessoa acabou de abrir um produto",
        "3 clientes visualizaram esta vitrine",
        "Prova social dinâmica ativa",
        "Iron Commerce otimizando a experiência"
      ];
  
      let index = 0;
  
      setInterval(() => {
        const badge = document.querySelector(".iron-badge span");
        if (!badge) return;
  
        index = (index + 1) % texts.length;
        badge.textContent = texts[index];
      }, 3200);
    }
  
    function boot() {
      addPremiumBar();
      addHero();
      addTrustStrip();
      addFloatingCRO();
      bindActions();
      rotateProof();
  
      console.log("🔥 Iron Theme Engine ativo");
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  })();