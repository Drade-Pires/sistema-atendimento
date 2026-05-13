const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar chamado
router.post('/', async (req, res) => {
  const { cliente_id, tecnico_id, descricao, status, endereco, data_atendimento } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO chamados (cliente_id, tecnico_id, descricao, status, endereco, data_atendimento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cliente_id, tecnico_id, descricao, status || 'aberto', endereco, data_atendimento]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar chamado' });
  }
});

// Listar chamados
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM chamados');
  res.json(result.rows);
});

module.exports = router;
