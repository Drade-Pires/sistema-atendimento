const express = require("express");
const router = express.Router();
const pool = require("../db");

// Cadastrar técnico (com verificação de região exclusiva)
router.post("/", async (req, res) => {
  const { nome, especialidade, regiao } = req.body;

  try {
    // Verifica se o técnico já existe em outra região
    const check = await pool.query(
      "SELECT * FROM tecnicos WHERE nome = $1 AND regiao <> $2",
      [nome, regiao]
    );

    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Técnico já pertence a outra região" });
    }

    // Insere novo técnico
    const result = await pool.query(
      "INSERT INTO tecnicos (nome, especialidade, regiao) VALUES ($1, $2, $3) RETURNING *",
      [nome, especialidade, regiao]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos os técnicos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tecnicos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar técnicos por região
router.get("/regiao/:regiao", async (req, res) => {
  const { regiao } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM tecnicos WHERE regiao = $1 ORDER BY id ASC",
      [regiao]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
