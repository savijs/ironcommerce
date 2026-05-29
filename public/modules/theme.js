(function () {
    console.log("🎨 Iron Theme ativo");
  
    if (document.querySelector("#iron-theme-style")) return;
  
    const style = document.createElement("style");
    style.id = "iron-theme-style";
  
    style.innerHTML = `
      body {
        background: #faf7f2 !important;
      }
  
      h1, h2, h3, .title, .section-title {
        font-family: Arial, sans-serif !important;
        letter-spacing: -0.04em !important;
        font-weight: 800 !important;
      }
  
      .js-item-product,
      .product-item,
      .item,
      [data-store*="product-item"] {
        border-radius: 22px !important;
        overflow: hidden !important;
        box-shadow: 0 10px 35px rgba(0,0,0,.08) !important;
        transition: .3s ease !important;
      }
  
      .js-item-product:hover,
      .product-item:hover,
      .item:hover,
      [data-store*="product-item"]:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 18px 55px rgba(0,0,0,.14) !important;
      }
    `;
  
    document.head.appendChild(style);
  })();