require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // conexão com Postgres

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const chamadosRoutes = require("./routes/chamados");
app.use("/chamados", chamadosRoutes);

const clientesRoutes = require("./routes/clientes");
app.use("/clientes", clientesRoutes);

const tecnicosRoutes = require("./routes/tecnicos");
app.use("/tecnicos", tecnicosRoutes);

const agendaRoutes = require("./routes/agenda");
app.use("/agenda", agendaRoutes);

const historicoRoutes = require("./routes/historico");
app.use("/historico", historicoRoutes);

const analistasRoutes = require("./routes/analistas");
app.use("/analistas", analistasRoutes);

const visitasRoutes = require("./routes/visitas");
app.use("/visitas", visitasRoutes);

const geocodeRoutes = require("./routes/geocode");
app.use("/geocode", geocodeRoutes);

// Rota de teste para conexão com banco
app.get("/pingdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0] });
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err.message);
    res.status(500).json({ error: "Falha na conexão com o banco" });
  }
});

// Porta dinâmica (Render define automaticamente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
