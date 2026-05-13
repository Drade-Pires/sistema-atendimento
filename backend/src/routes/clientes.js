const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cadastrar cliente
router.post('/', async (req, res) => {
  const { nome, contato } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nome, contato) VALUES ($1, $2) RETURNING *',
      [nome, contato]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar clientes
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM clientes');
  res.json(result.rows);
});

module.exports = router;
