const express = require('express');
const router = express.Router();
const pool = require('../db');

// Histórico de um cliente
router.get('/:cliente_id', async (req, res) => {
  const { cliente_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.descricao, c.status, c.data, t.nome AS tecnico
       FROM chamados c
       JOIN tecnicos t ON c.tecnico_id = t.id
       WHERE c.cliente_id = $1
       ORDER BY c.data DESC`,
      [cliente_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
