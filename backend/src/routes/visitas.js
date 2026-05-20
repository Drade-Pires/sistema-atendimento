const express = require("express");
const router = express.Router();
const pool = require("../db");

// Criar visita
router.post("/", async (req, res) => {
  const {
    data_agendamento,
    tecnico_id,
    analista_id,
    zona,
    empresa,
    endereco,
    latitude,
    longitude,
    status
  } = req.body;

  if (!data_agendamento || !tecnico_id || !analista_id || !empresa || !endereco) {
    return res.status(400).json({
      error: "Campos obrigatórios: data_agendamento, tecnico_id, analista_id, empresa, endereco."
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO visitas 
       (data_agendamento, tecnico_id, analista_id, zona, empresa, endereco, latitude, longitude, status) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [data_agendamento, tecnico_id, analista_id, zona, empresa, endereco, latitude, longitude, status]
    );

    const visita = result.rows[0];

    // Buscar nomes relacionados
    const joinResult = await pool.query(`
      SELECT v.*, t.nome AS tecnico, a.nome AS analista
      FROM visitas v
      JOIN tecnicos t ON v.tecnico_id = t.id
      JOIN analistas a ON v.analista_id = a.id
      WHERE v.id = $1
    `, [visita.id]);

    res.status(201).json(joinResult.rows[0]);
  } catch (err) {
    console.error("Erro ao criar visita:", err);
    res.status(500).json({ error: "Erro interno ao criar visita." });
  }
});

// Listar visitas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, t.nome AS tecnico, a.nome AS analista
      FROM visitas v
      JOIN tecnicos t ON v.tecnico_id = t.id
      JOIN analistas a ON v.analista_id = a.id
      ORDER BY v.data_agendamento ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar visitas:", err);
    res.status(500).json({ error: "Erro interno ao listar visitas." });
  }
});

// Atualizar visita
router.put("/:id", async (req, res) => {
  const {
    data_agendamento,
    tecnico_id,
    analista_id,
    zona,
    empresa,
    endereco,
    status
  } = req.body;

  try {
    await pool.query(
      `UPDATE visitas 
       SET data_agendamento=$1, tecnico_id=$2, analista_id=$3, zona=$4, empresa=$5, endereco=$6, status=$7
       WHERE id=$8`,
      [data_agendamento, tecnico_id, analista_id, zona, empresa, endereco, status, req.params.id]
    );

    const result = await pool.query(`
      SELECT v.*, t.nome AS tecnico, a.nome AS analista
      FROM visitas v
      JOIN tecnicos t ON v.tecnico_id = t.id
      JOIN analistas a ON v.analista_id = a.id
      WHERE v.id = $1
    `, [req.params.id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar visita:", err);
    res.status(500).json({ error: "Erro interno ao atualizar visita." });
  }
});

// Excluir visita
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM visitas WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao excluir visita:", err);
    res.status(500).json({ error: "Erro interno ao excluir visita." });
  }
});

module.exports = router;
