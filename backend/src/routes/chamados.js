const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar chamado
router.post("/", async (req, res) => {
  const { empresa, endereco, latitude, longitude, status } = req.body;

  if (!empresa || !endereco) {
    return res.status(400).json({ error: "Campos obrigatórios: empresa e endereco." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO chamados (empresa, endereco, latitude, longitude, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [empresa, endereco, latitude, longitude, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar chamado:", err);
    res.status(500).json({ error: "Erro interno ao criar chamado." });
  }
});

// Listar chamados
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM chamados ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar chamados:", err);
    res.status(500).json({ error: "Erro interno ao listar chamados." });
  }
});

module.exports = router;
