document.addEventListener("DOMContentLoaded", async () => {
  const modulesGrid = document.getElementById("modules-grid");
  const storeModulesWrap = document.getElementById("store-modules-wrap");

  const modules = [
    {
      icon: "🎨",
      name: "Theme Module",
      description: "CSS premium aplicado na vitrine da loja.",
      field: "theme_enabled",
    },
    {
      icon: "⚡",
      name: "CRO Module",
      description: "Barra promocional no topo da loja.",
      field: "cro_enabled",
    },
    {
      icon: "🎬",
      name: "Stories Module",
      description: "Carrossel de stories carregado dinamicamente.",
      field: "stories_enabled",
    },
    {
      icon: "⭐",
      name: "Reviews Module",
      description: "Módulo de avaliações — em breve.",
      field: "reviews_enabled",
    },
  ];

  try {
    const data = await IronAdmin.api.getStores();
    const stores = data.stores;

    const activeCounts = modules.reduce((acc, module) => {
      acc[module.field] = stores.filter((store) => store[module.field]).length;
      return acc;
    }, {});

    modulesGrid.innerHTML = modules
      .map(
        (module) => `
          <div class="app-card">
            <h3>${module.icon} ${module.name}</h3>
            <p>${module.description}</p>
            <span class="app-status ${activeCounts[module.field] > 0 ? "active" : "inactive"}">
              ${activeCounts[module.field]} loja(s) ativa(s)
            </span>
          </div>
        `
      )
      .join("");

    if (!stores.length) {
      storeModulesWrap.innerHTML = `<div class="empty-state">Nenhuma loja cadastrada.</div>`;
      return;
    }

    storeModulesWrap.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Store ID</th>
            <th>Theme</th>
            <th>CRO</th>
            <th>Stories</th>
            <th>Reviews</th>
          </tr>
        </thead>
        <tbody>
          ${stores
            .map(
              (store) => `
                <tr>
                  <td>${store.store_id}</td>
                  <td>${renderStatus(store.theme_enabled)}</td>
                  <td>${renderStatus(store.cro_enabled)}</td>
                  <td>${renderStatus(store.stories_enabled)}</td>
                  <td>${renderStatus(store.reviews_enabled)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (error) {
    storeModulesWrap.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }

  function renderStatus(active) {
    return active
      ? `<span class="app-status active">Ativo</span>`
      : `<span class="app-status inactive">Inativo</span>`;
  }
});
