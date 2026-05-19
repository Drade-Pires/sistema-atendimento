const express = require("express");
const fetch = require("node-fetch"); // versão 2
require("dotenv").config();

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  try {
    const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&q=${encodeURIComponent(q)}&format=json`;
    const resp = await fetch(url);

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `Erro na API LocationIQ: ${resp.status}` });
    }

    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar endereço:", err.message);
    res.status(500).json({ error: "Erro ao buscar endereço" });
  }
});

module.exports = router;
