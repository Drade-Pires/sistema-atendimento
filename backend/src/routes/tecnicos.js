const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastrar técnico
router.post('/', async (req, res) => {
  const { nome, especialidade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tecnicos (nome, especialidade) VALUES ($1, $2) RETURNING *',
      [nome, especialidade]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar técnicos
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM tecnicos');
  res.json(result.rows);
});

module.exports = router;
