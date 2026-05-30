window.IronAdmin = window.IronAdmin || {};

IronAdmin.api = {
  async request(path, options = {}) {
    const response = await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Erro na requisição");
    }

    return data;
  },

  getStats() {
    return this.request("/api/admin/stats");
  },

  getStores() {
    return this.request("/api/admin/stores");
  },

  updateStore(storeId, payload) {
    return this.request(`/api/admin/stores/${storeId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  getStories(storeId) {
    const query = storeId ? `?store_id=${encodeURIComponent(storeId)}` : "";
    return this.request(`/api/admin/stories${query}`);
  },

  createStory(payload) {
    return this.request("/api/admin/stories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateStory(id, payload) {
    return this.request(`/api/admin/stories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteStory(id, deactivate = false) {
    const query = deactivate ? "?deactivate=true" : "";
    return this.request(`/api/admin/stories/${id}${query}`, {
      method: "DELETE",
    });
  },
};

IronAdmin.ui = {
  showAlert(container, message, type = "success") {
    if (!container) return;

    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;

    setTimeout(() => {
      container.innerHTML = "";
    }, 4000);
  },

  formatBool(value) {
    return value ? "Sim" : "Não";
  },
};
