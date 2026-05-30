(function () {
  const IRON_BASE_URL = "https://ironcommerce.onrender.com";
  const CONFIG_POLL_MS = 15000;

  const MODULES = {
    theme: { label: "Theme", file: "theme" },
    cro: { label: "CRO", file: "cro" },
    stories: { label: "Stories", file: "stories" },
    reviews: { label: "Reviews", file: "reviews" },
  };

  window.IronModules = window.IronModules || {};

  const state = {
    storeId: null,
    active: {},
    loaded: {},
    polling: false,
  };

  function getStoreId() {
    const currentScript = document.currentScript;

    if (currentScript && currentScript.src) {
      const url = new URL(currentScript.src);
      return url.searchParams.get("store");
    }

    const loader = [...document.scripts].find((script) =>
      script.src.includes("iron-loader.js")
    );

    if (loader) {
      const url = new URL(loader.src);
      return url.searchParams.get("store");
    }

    return null;
  }

  function logModuleState(name, enabled) {
    const label = MODULES[name]?.label || name;
    console.log(`[IRON] ${label} ${enabled ? "ativo" : "desativado"}`);
  }

  function loadModuleScript(name) {
    return new Promise((resolve, reject) => {
      if (state.loaded[name]) {
        resolve();
        return;
      }

      const meta = MODULES[name];

      if (!meta) {
        reject(new Error(`Módulo desconhecido: ${name}`));
        return;
      }

      const script = document.createElement("script");
      script.src = `${IRON_BASE_URL}/modules/${meta.file}.js?v=${Date.now()}`;
      script.async = true;
      script.dataset.ironModule = name;

      script.onload = function () {
        state.loaded[name] = true;
        resolve();
      };

      script.onerror = function () {
        console.error(`[IRON] Erro ao carregar módulo: ${name}`);
        reject(new Error(`Falha ao carregar módulo: ${name}`));
      };

      document.head.appendChild(script);
    });
  }

  async function activateModule(name) {
    await loadModuleScript(name);

    if (!window.IronModules[name]?.activate) {
      console.warn(`[IRON] Módulo ${name} carregado sem handler activate`);
      return;
    }

    window.IronModules[name].activate();
    state.active[name] = true;
    logModuleState(name, true);
  }

  function deactivateModule(name) {
    if (!window.IronModules[name]?.deactivate) {
      state.active[name] = false;
      logModuleState(name, false);
      return;
    }

    window.IronModules[name].deactivate();
    state.active[name] = false;
    logModuleState(name, false);
  }

  async function syncModules(modulesConfig) {
    const tasks = Object.keys(MODULES).map(async (name) => {
      const shouldBeActive = !!modulesConfig[name];
      const isActive = !!state.active[name];

      if (shouldBeActive && !isActive) {
        await activateModule(name);
        return;
      }

      if (!shouldBeActive && isActive) {
        deactivateModule(name);
      }
    });

    await Promise.all(tasks);
  }

  async function fetchConfig() {
    const response = await fetch(`${IRON_BASE_URL}/config/${state.storeId}`, {
      cache: "no-store",
    });

    return response.json();
  }

  async function applyConfig() {
    try {
      const config = await fetchConfig();

      if (!config.success) {
        console.warn("[IRON] Config inválida", config);
        return;
      }

      console.log("[IRON] Config recebida:", config.modules);
      await syncModules(config.modules);
    } catch (error) {
      console.error("[IRON] Erro ao sincronizar configuração:", error);
    }
  }

  async function boot() {
    state.storeId = getStoreId();

    if (!state.storeId) {
      console.warn("[IRON] store_id não encontrado na URL do script");
      return;
    }

    console.log(`[IRON] Loader iniciado — loja ${state.storeId}`);

    await applyConfig();

    if (state.polling) return;

    state.polling = true;
    setInterval(applyConfig, CONFIG_POLL_MS);
  }

  boot();
})();
