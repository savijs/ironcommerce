document.addEventListener("DOMContentLoaded", async () => {
  const alertContainer = document.getElementById("alert-container");

  try {
    const data = await IronAdmin.api.getStats();

    document.getElementById("stat-stores").textContent = data.stats.stores;
    document.getElementById("stat-stories").textContent = data.stats.stories;
    document.getElementById("stat-modules").textContent = data.stats.active_modules;
    document.getElementById("stat-pro").textContent = data.stats.pro_plans;

    const recentContainer = document.getElementById("recent-stores");

    if (!data.recent_stores.length) {
      recentContainer.innerHTML = `<div class="empty-state">Nenhuma loja cadastrada.</div>`;
      return;
    }

    recentContainer.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Store ID</th>
            <th>Plano</th>
            <th>Theme</th>
            <th>CRO</th>
            <th>Stories</th>
            <th>Reviews</th>
          </tr>
        </thead>
        <tbody>
          ${data.recent_stores
            .map(
              (store) => `
                <tr>
                  <td>${store.store_id}</td>
                  <td>${store.plan || "—"}</td>
                  <td>${IronAdmin.ui.formatBool(store.theme_enabled)}</td>
                  <td>${IronAdmin.ui.formatBool(store.cro_enabled)}</td>
                  <td>${IronAdmin.ui.formatBool(store.stories_enabled)}</td>
                  <td>${IronAdmin.ui.formatBool(store.reviews_enabled)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (error) {
    IronAdmin.ui.showAlert(alertContainer, error.message, "error");
  }
});
