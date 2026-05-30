(function () {
  console.log("🔥 Iron Loader iniciado");

  const IRON_BASE_URL = "https://ironcommerce.onrender.com";

  function getStoreId() {
    const currentScript = document.currentScript;

    if (currentScript && currentScript.src) {
      const url = new URL(currentScript.src);
      return url.searchParams.get("store");
    }

    return null;
  }

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

  async function boot() {
    const storeId = getStoreId();

    if (!storeId) {
      console.warn("⚠️ Iron Loader: store_id não encontrado na URL do script");
      return;
    }

    try {
      const response = await fetch(`${IRON_BASE_URL}/config/${storeId}`);
      const config = await response.json();

      console.log("⚙️ Iron config:", config);

      if (!config.success) {
        console.warn("⚠️ Iron config inválida", config);
        return;
      }

      Object.keys(config.modules).forEach((moduleName) => {
        if (config.modules[moduleName]) {
          loadModule(moduleName);
        }
      });
    } catch (error) {
      console.error("❌ Erro ao carregar configuração Iron:", error);
    }
  }

  boot();
})();