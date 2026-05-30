const supabase = require("../supabase");

const STORE_FIELDS = [
  "plan",
  "theme_enabled",
  "cro_enabled",
  "stories_enabled",
  "reviews_enabled",
];

const STORY_FIELDS = ["store_id", "title", "link_url", "sort_order", "active"];

function pickFields(body, allowed) {
  const result = {};

  allowed.forEach((field) => {
    if (body[field] !== undefined) {
      result[field] = body[field];
    }
  });

  return result;
}

module.exports = function registerAdminApi(app) {
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const { data: stores, error: storesError } = await supabase
        .from("stores")
        .select("*");

      if (storesError) {
        return res.status(400).json({ success: false, message: storesError.message });
      }

      const { count: storiesCount, error: storiesError } = await supabase
        .from("stories")
        .select("*", { count: "exact", head: true });

      if (storiesError) {
        return res.status(400).json({ success: false, message: storiesError.message });
      }

      const moduleCount = stores.reduce((total, store) => {
        return (
          total +
          [store.theme_enabled, store.cro_enabled, store.stories_enabled, store.reviews_enabled].filter(
            Boolean
          ).length
        );
      }, 0);

      const proCount = stores.filter((store) => store.plan === "pro").length;

      res.json({
        success: true,
        stats: {
          stores: stores.length,
          stories: storiesCount || 0,
          active_modules: moduleCount,
          pro_plans: proCount,
        },
        recent_stores: stores.slice(0, 5),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get("/api/admin/stores", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .order("store_id", { ascending: true });

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ success: true, stores: data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.patch("/api/admin/stores/:storeId", async (req, res) => {
    const { storeId } = req.params;
    const updates = pickFields(req.body, STORE_FIELDS);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum campo válido para atualizar",
      });
    }

    try {
      const { data, error } = await supabase
        .from("stores")
        .update(updates)
        .eq("store_id", storeId)
        .select("*")
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ success: true, store: data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get("/api/admin/stories", async (req, res) => {
    const { store_id } = req.query;

    try {
      let query = supabase.from("stories").select("*").order("sort_order", { ascending: true });

      if (store_id) {
        query = query.eq("store_id", store_id);
      }

      const { data, error } = await query;

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ success: true, stories: data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post("/api/admin/stories", async (req, res) => {
    const payload = pickFields(req.body, STORY_FIELDS);

    if (!payload.store_id || !payload.title) {
      return res.status(400).json({
        success: false,
        message: "store_id e title são obrigatórios",
      });
    }

    if (payload.active === undefined) {
      payload.active = true;
    }

    if (payload.sort_order === undefined) {
      payload.sort_order = 0;
    }

    try {
      const { data, error } = await supabase
        .from("stories")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.status(201).json({ success: true, story: data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.patch("/api/admin/stories/:id", async (req, res) => {
    const { id } = req.params;
    const updates = pickFields(req.body, STORY_FIELDS.filter((field) => field !== "store_id"));

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum campo válido para atualizar",
      });
    }

    try {
      const { data, error } = await supabase
        .from("stories")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ success: true, story: data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/admin/stories/:id", async (req, res) => {
    const { id } = req.params;
    const deactivate = req.query.deactivate === "true";

    try {
      if (deactivate) {
        const { data, error } = await supabase
          .from("stories")
          .update({ active: false })
          .eq("id", id)
          .select("*")
          .single();

        if (error) {
          return res.status(400).json({ success: false, message: error.message });
        }

        return res.json({ success: true, story: data, action: "deactivated" });
      }

      const { error } = await supabase.from("stories").delete().eq("id", id);

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ success: true, action: "deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
};
