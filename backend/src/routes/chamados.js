const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar chamado
router.post("/", async (req, res) => {
  const {
    empresa,
    endereco,
    latitude,
    longitude,
    status
  } = req.body;

  try {
    await db.query(
      "INSERT INTO chamados (empresa, endereco, latitude, longitude, status) VALUES (?, ?, ?, ?, ?)",
      [empresa, endereco, latitude, longitude, status]
    );
    res.status(201).json({ message: "Chamado criado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar chamado" });
  }
});


// Listar chamados
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM chamados');
  res.json(result.rows);
});

module.exports = router;
