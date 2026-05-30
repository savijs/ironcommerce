const path = require("path");

const pages = {
  "/dashboard": "dashboard.html",
  "/stores": "stores.html",
  "/stories-admin": "stories-admin.html",
  "/apps": "apps.html",
};

module.exports = function registerAdminPages(app) {
  Object.entries(pages).forEach(([route, file]) => {
    app.get(route, (req, res) => {
      res.sendFile(path.join(__dirname, "..", "views", "admin", file));
    });
  });
};
