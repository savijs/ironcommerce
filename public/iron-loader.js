(function () {
  console.log("🔥 Iron Loader iniciado");

  const IRON_BASE_URL = "https://ironcommerce.onrender.com";

  const activeModules = [
    "theme",
    "cro",
    "stories"
  ];

  function loadModule(name) {
    const script = document.createElement("script");
    script.src = `${IRON_BASE_URL}/modules/${name}.js?v=${Date.now()}`;
    script.async = true;
    script.onload = function () {
      console.log(`✅ Iron módulo carregado: ${name}`);
    };
    script.onerror = function () {
      console.error(`❌ Erro ao carregar módulo: ${name}`);
    };
    document.head.appendChild(script);
  }

  activeModules.forEach(loadModule);
})();