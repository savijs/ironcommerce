const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const supabase = require("./supabase");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(`
    <h1>🔥 Iron Commerce</h1>

    <p>Servidor funcionando.</p>

    <a href="https://www.tiendanube.com/apps/${process.env.NUVEMSHOP_CLIENT_ID}/authorize">
      Conectar com Nuvemshop
    </a>
  `);
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.send("Code não recebido.");
  }

  try {
    const response = await axios.post(
      "https://www.tiendanube.com/apps/authorize/token",
      {
        client_id: process.env.NUVEMSHOP_CLIENT_ID,
        client_secret: process.env.NUVEMSHOP_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("TOKEN:");
    console.log(response.data);

    res.send(`
      <h1>🔥 Loja conectada com sucesso</h1>

      <pre>${JSON.stringify(response.data, null, 2)}</pre>

      <p>Seu script:</p>

      <code>
        ${process.env.APP_URL}/iron-loader.js
      </code>
    `);
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.send(`
      <h1>Erro OAuth</h1>

      <pre>
${JSON.stringify(error.response?.data || error.message, null, 2)}
      </pre>
    `);
  }
});



app.get("/install-script", async (req, res) => {
    const storeId = "7777191";
  
    const accessToken = "c371e0f14c2096cbaeb412eccf8c5fbd05cac597";
  
    try {
      const response = await axios.post(
        `https://api.tiendanube.com/v1/${storeId}/scripts`,
        {
          script_id: 6991,
          query_params: "{}",
        },
        {
          headers: {
            Authentication: `bearer ${accessToken}`,
            "User-Agent": "Iron Commerce samuelsouzasavi@gmail.com",
            "Content-Type": "application/json",
          },
        }
      );
  
      res.send(`
        <h1>🔥 Script instalado com sucesso</h1>
  
        <pre>${JSON.stringify(response.data, null, 2)}</pre>
  
        <p>Agora abra sua loja.</p>
      `);
    } catch (error) {
      res.send(`
        <h1>Erro ao instalar</h1>
  
        <pre>
  ${JSON.stringify(error.response?.data || error.message, null, 2)}
        </pre>
      `);
    }
  });


app.get("/config/:storeId", async (req, res) => {
  const { storeId } = req.params;

  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("store_id", storeId)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Loja não encontrada",
        error
      });
    }

    res.json({
      success: true,
      store_id: data.store_id,
      plan: data.plan,
      modules: {
        theme: data.theme_enabled,
        cro: data.cro_enabled,
        stories: data.stories_enabled,
        reviews: data.reviews_enabled
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

app.get("/debug/stores", async (req, res) => {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .limit(10);

  res.json({
    success: !error,
    data,
    error
  });
});

app.get("/stories/:storeId", async (req, res) => {
  const { storeId } = req.params;

  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("store_id", storeId)
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar stories",
        error
      });
    }

    res.json({
      success: true,
      store_id: storeId,
      stories: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});



require("./routes/admin-pages")(app);
require("./routes/admin-api")(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("🔥 Servidor rodando");
});