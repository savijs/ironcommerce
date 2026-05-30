(function () {
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/stores", label: "Lojas" },
    { href: "/stories-admin", label: "Stories" },
    { href: "/apps", label: "Apps" },
  ];

  function getCurrentPath() {
    return window.location.pathname;
  }

  function renderSidebar() {
    const sidebar = document.getElementById("admin-sidebar");

    if (!sidebar) return;

    const currentPath = getCurrentPath();

    sidebar.innerHTML = `
      <div class="admin-brand">🔥 Iron Commerce</div>
      <nav class="admin-nav">
        ${navItems
          .map(
            (item) => `
              <a href="${item.href}" class="${currentPath === item.href ? "active" : ""}">
                ${item.label}
              </a>
            `
          )
          .join("")}
      </nav>
      <div class="admin-sidebar-footer">Dashboard MVP v1.0</div>
    `;
  }

  document.addEventListener("DOMContentLoaded", renderSidebar);
})();
