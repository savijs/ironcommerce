document.addEventListener("DOMContentLoaded", async () => {
  const alertContainer = document.getElementById("alert-container");
  const tableWrap = document.getElementById("stories-table-wrap");
  const storeFilter = document.getElementById("store-filter");
  const storyStoreSelect = document.getElementById("story-store-id");
  const modal = document.getElementById("story-modal");
  const form = document.getElementById("story-form");
  const modalTitle = document.getElementById("modal-title");
  const storyIdInput = document.getElementById("story-id");
  const videoInput = document.getElementById("story-video");
  const videoCurrentHint = document.getElementById("story-video-current");

  const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

  let stores = [];
  let storiesCache = [];

  async function loadStores() {
    const data = await IronAdmin.api.getStores();
    stores = data.stores;

    const options = stores
      .map((store) => `<option value="${store.store_id}">${store.store_id}</option>`)
      .join("");

    storeFilter.innerHTML = `<option value="">Todas as lojas</option>${options}`;
    storyStoreSelect.innerHTML = options;
  }

  async function loadStories() {
    try {
      const storeId = storeFilter.value;
      const data = await IronAdmin.api.getStories(storeId || undefined);
      storiesCache = data.stories;

      if (!data.stories.length) {
        tableWrap.innerHTML = `<div class="empty-state">Nenhum story encontrado.</div>`;
        return;
      }

      tableWrap.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loja</th>
              <th>Título</th>
              <th>Vídeo</th>
              <th>Link</th>
              <th>Ordem</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${data.stories.map((story) => renderRow(story)).join("")}
          </tbody>
        </table>
      `;

      bindRowActions();
    } catch (error) {
      IronAdmin.ui.showAlert(alertContainer, error.message, "error");
    }
  }

  function renderRow(story) {
    return `
      <tr>
        <td>${story.id}</td>
        <td>${story.store_id}</td>
        <td>${story.title}</td>
        <td>${story.media_url ? "Sim" : "Não"}</td>
        <td>${story.link_url || "—"}</td>
        <td>${story.sort_order ?? 0}</td>
        <td>${IronAdmin.ui.formatBool(story.active)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" data-edit-story-id="${story.id}">
            Editar
          </button>
          <button class="btn btn-secondary btn-sm" data-deactivate-story="${story.id}">
            Desativar
          </button>
          <button class="btn btn-danger btn-sm" data-delete-story="${story.id}">
            Excluir
          </button>
        </td>
      </tr>
    `;
  }

  function bindRowActions() {
    tableWrap.querySelectorAll("[data-edit-story-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const story = storiesCache.find((item) => String(item.id) === button.dataset.editStoryId);
        if (story) openModal(story);
      });
    });

    tableWrap.querySelectorAll("[data-deactivate-story]").forEach((button) => {
      button.addEventListener("click", () => deactivateStory(button.dataset.deactivateStory));
    });

    tableWrap.querySelectorAll("[data-delete-story]").forEach((button) => {
      button.addEventListener("click", () => deleteStory(button.dataset.deleteStory));
    });
  }

  function setVideoHint(story) {
    if (story?.media_url) {
      videoCurrentHint.innerHTML = `Vídeo atual: <a href="${story.media_url}" target="_blank" rel="noopener">ver arquivo</a>. Envie um novo para substituir.`;
      return;
    }

    videoCurrentHint.textContent = "Nenhum vídeo cadastrado.";
  }

  function openModal(story = null) {
    modal.classList.add("open");
    videoInput.value = "";

    if (story) {
      modalTitle.textContent = "Editar story";
      storyIdInput.value = story.id;
      storyStoreSelect.value = story.store_id;
      storyStoreSelect.disabled = true;
      document.getElementById("story-title").value = story.title;
      document.getElementById("story-link-url").value = story.link_url || "";
      document.getElementById("story-sort-order").value = story.sort_order ?? 0;
      document.getElementById("story-active").checked = !!story.active;
      setVideoHint(story);
    } else {
      modalTitle.textContent = "Novo story";
      storyIdInput.value = "";
      storyStoreSelect.disabled = false;
      form.reset();
      document.getElementById("story-active").checked = true;
      videoCurrentHint.textContent = "Opcional. Stories sem vídeo usam fallback visual na loja.";

      if (storeFilter.value) {
        storyStoreSelect.value = storeFilter.value;
      }
    }
  }

  function closeModal() {
    modal.classList.remove("open");
    storyStoreSelect.disabled = false;
    form.reset();
    videoCurrentHint.textContent = "";
  }

  function validateVideoFile(file) {
    if (!file) return null;

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return "Formato inválido. Use .mp4, .webm ou .mov";
    }

    if (file.size > MAX_VIDEO_BYTES) {
      return "Vídeo excede o limite de 50MB";
    }

    return null;
  }

  function buildFormData() {
    const formData = new FormData();

    formData.append("store_id", storyStoreSelect.value);
    formData.append("title", document.getElementById("story-title").value.trim());
    formData.append("link_url", document.getElementById("story-link-url").value.trim());
    formData.append("sort_order", String(Number(document.getElementById("story-sort-order").value) || 0));
    formData.append("active", document.getElementById("story-active").checked ? "true" : "false");

    const videoFile = videoInput.files[0];

    if (videoFile) {
      formData.append("video", videoFile);
    }

    return { formData, videoFile };
  }

  async function deactivateStory(id) {
    if (!confirm("Desativar este story?")) return;

    try {
      await IronAdmin.api.deleteStory(id, true);
      IronAdmin.ui.showAlert(alertContainer, "Story desativado.");
      loadStories();
    } catch (error) {
      IronAdmin.ui.showAlert(alertContainer, error.message, "error");
    }
  }

  async function deleteStory(id) {
    if (!confirm("Excluir permanentemente este story?")) return;

    try {
      await IronAdmin.api.deleteStory(id, false);
      IronAdmin.ui.showAlert(alertContainer, "Story excluído.");
      loadStories();
    } catch (error) {
      IronAdmin.ui.showAlert(alertContainer, error.message, "error");
    }
  }

  document.getElementById("btn-new-story").addEventListener("click", () => openModal());
  document.getElementById("btn-cancel-modal").addEventListener("click", closeModal);
  storeFilter.addEventListener("change", loadStories);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { formData, videoFile } = buildFormData();
    const videoError = validateVideoFile(videoFile);

    if (videoError) {
      IronAdmin.ui.showAlert(alertContainer, videoError, "error");
      return;
    }

    const textPayload = {
      title: document.getElementById("story-title").value.trim(),
      link_url: document.getElementById("story-link-url").value.trim(),
      sort_order: Number(document.getElementById("story-sort-order").value) || 0,
      active: document.getElementById("story-active").checked,
    };

    try {
      if (storyIdInput.value) {
        if (videoFile) {
          formData.append("store_id", storyStoreSelect.value);
          await IronAdmin.api.updateStoryWithVideo(storyIdInput.value, formData);
        } else {
          await IronAdmin.api.updateStory(storyIdInput.value, textPayload);
        }

        IronAdmin.ui.showAlert(alertContainer, "Story atualizado.");
      } else if (videoFile) {
        await IronAdmin.api.createStoryWithVideo(formData);
        IronAdmin.ui.showAlert(alertContainer, "Story criado com vídeo.");
      } else {
        await IronAdmin.api.createStory({
          store_id: storyStoreSelect.value,
          ...textPayload,
        });
        IronAdmin.ui.showAlert(alertContainer, "Story criado.");
      }

      closeModal();
      loadStories();
    } catch (error) {
      IronAdmin.ui.showAlert(alertContainer, error.message, "error");
    }
  });

  try {
    await loadStores();
    await loadStories();
  } catch (error) {
    IronAdmin.ui.showAlert(alertContainer, error.message, "error");
  }
});
