const express = require('express');
const router = express.Router();
const pool = require('../db');

// Agenda de técnicos: lista chamados por técnico
router.get('/:tecnico_id', async (req, res) => {
  const { tecnico_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.descricao, c.status, c.data, cl.nome AS cliente
       FROM chamados c
       JOIN clientes cl ON c.cliente_id = cl.id
       WHERE c.tecnico_id = $1
       ORDER BY c.data ASC`,
      [tecnico_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
