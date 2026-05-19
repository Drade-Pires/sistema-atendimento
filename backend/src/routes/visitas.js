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
      error: "Verifique e complete todas as informações obrigatórias antes de salvar a visita."
    });
  }

  try {
    // insere e retorna o id
    const result = await pool.query(
      `INSERT INTO visitas 
       (data_agendamento, tecnico_id, analista_id, zona, empresa, endereco, latitude, longitude, status) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [data_agendamento, tecnico_id, analista_id, zona, empresa, endereco, latitude, longitude, status]
    );

    const id = result.rows[0].id;

    // busca a visita criada já com join para trazer nomes
    const visitaCriada = await pool.query(`
      SELECT v.*, t.nome AS tecnico, a.nome AS analista
      FROM visitas v
      JOIN tecnicos t ON v.tecnico_id = t.id
      JOIN analistas a ON v.analista_id = a.id
      WHERE v.id = $1
    `, [id]);

    res.status(201).json(visitaCriada.rows[0]);
  } catch (err) {
    console.error("Erro ao criar visita:", err);
    res.status(500).json({ error: "Erro interno ao criar visita. Tente novamente mais tarde." });
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

    // busca novamente com join para trazer nomes atualizados
    const visitaAtualizada = await pool.query(`
      SELECT v.*, t.nome AS tecnico, a.nome AS analista
      FROM visitas v
      JOIN tecnicos t ON v.tecnico_id = t.id
      JOIN analistas a ON v.analista_id = a.id
      WHERE v.id = $1
    `, [req.params.id]);

    res.json(visitaAtualizada.rows[0]);
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
