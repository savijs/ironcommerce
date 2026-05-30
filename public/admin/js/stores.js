document.addEventListener("DOMContentLoaded", async () => {
  const alertContainer = document.getElementById("alert-container");
  const tableWrap = document.getElementById("stores-table-wrap");

  const moduleFields = [
    { key: "theme_enabled", label: "Theme" },
    { key: "cro_enabled", label: "CRO" },
    { key: "stories_enabled", label: "Stories" },
    { key: "reviews_enabled", label: "Reviews" },
  ];

  async function loadStores() {
    try {
      const data = await IronAdmin.api.getStores();

      if (!data.stores.length) {
        tableWrap.innerHTML = `<div class="empty-state">Nenhuma loja cadastrada.</div>`;
        return;
      }

      tableWrap.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Store ID</th>
              <th>Plano</th>
              ${moduleFields.map((field) => `<th>${field.label}</th>`).join("")}
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${data.stores.map((store) => renderRow(store)).join("")}
          </tbody>
        </table>
      `;

      tableWrap.querySelectorAll("[data-save-store]").forEach((button) => {
        button.addEventListener("click", () => saveStore(button.dataset.saveStore));
      });
    } catch (error) {
      IronAdmin.ui.showAlert(alertContainer, error.message, "error");
    }
  }

  function renderRow(store) {
    return `
      <tr data-store-row="${store.store_id}">
        <td>${store.store_id}</td>
        <td>
          <select data-field="plan" data-store-id="${store.store_id}">
            <option value="free" ${store.plan === "free" ? "selected" : ""}>free</option>
            <option value="pro" ${store.plan === "pro" ? "selected" : ""}>pro</option>
          </select>
        </td>
        ${moduleFields
          .map(
            (field) => `
              <td class="toggle-cell">
                <input
                  type="checkbox"
                  data-field="${field.key}"
                  data-store-id="${store.store_id}"
                  ${store[field.key] ? "checked" : ""}
                />
              </td>
            `
          )
          .join("")}
        <td>
          <button class="btn btn-primary btn-sm" data-save-store="${store.store_id}">
            Salvar
          </button>
        </td>
      </tr>
    `;
  }

  async function saveStore(storeId) {
    const row = tableWrap.querySelector(`[data-store-row="${storeId}"]`);

    if (!row) return;

    const payload = {};

    row.querySelectorAll("[data-field]").forEach((input) => {
      const field = input.dataset.field;

      if (input.type === "checkbox") {
        payload[field] = input.checked;
      } else {
        payload[field] = input.value;
      }
    });

    try {
      await IronAdmin.api.updateStore(storeId, payload);
      IronAdmin.ui.showAlert(alertContainer, `Loja ${storeId} atualizada com sucesso.`);
    } catch (error) {
      IronAdmin.ui.showAlert(alertContainer, error.message, "error");
    }
  }

  loadStores();
});
