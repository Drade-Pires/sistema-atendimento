const express = require("express");
const router = express.Router();
const pool = require("../db"); 

// Criar visita
router.post("/", async (req, res) => {
  let {
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

  // Validação simples
  if (!data_agendamento || !tecnico_id || !analista_id || !empresa || !endereco) {
    return res.status(400).json({
      error: "Verifique e complete todas as informações obrigatórias antes de salvar a visita."
    });
  }

  try {
    await pool.query(
      `INSERT INTO visitas 
       (data_agendamento, tecnico_id, analista_id, zona, empresa, endereco, latitude, longitude, status) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [data_agendamento, tecnico_id, analista_id, zona, empresa, endereco, latitude, longitude, status]
    );
    res.status(201).json({ message: "Visita criada com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar visita:", err);
    res.status(500).json({ error: "Erro interno ao criar visita. Tente novamente mais tarde." });
  }
});

async function salvarVisita() {
  try {
    const resp = await criarVisita(novaVisita);
    if (resp.message) {
      alert(resp.message); // mostra mensagem de sucesso
    } else if (resp.error) {
      alert(resp.error); // mostra mensagem de erro amigável
    }
  } catch (err) {
    alert("Erro inesperado ao salvar a visita.");
  }
}



// listar visitas
router.get("/", async (req, res) => {
  const result = await pool.query(`
    SELECT v.*, t.nome AS tecnico, a.nome AS analista
    FROM visitas v
    JOIN tecnicos t ON v.tecnico_id = t.id
    JOIN analistas a ON v.analista_id = a.id
    ORDER BY v.data_agendamento ASC
  `);
  res.json(result.rows);
});

// atualizar visita
router.put("/:id", async (req, res) => {
  const { data_agendamento, zona, empresa, endereco, status } = req.body;
  const result = await pool.query(
    `UPDATE visitas SET data_agendamento=$1, zona=$2, empresa=$3, endereco=$4, status=$5
     WHERE id=$6 RETURNING *`,
    [data_agendamento, zona, empresa, endereco, status, req.params.id]
  );
  res.json(result.rows[0]);
});

// excluir visita
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM visitas WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
