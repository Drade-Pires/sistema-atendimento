const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastrar analista
router.post('/', async (req, res) => {
  const { nome, especialidade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO analistas (nome, especialidade) VALUES ($1, $2) RETURNING *',
      [nome, especialidade]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar analistas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analistas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
