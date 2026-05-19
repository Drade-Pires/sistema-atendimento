import React, { useState } from "react";

function EnderecoInput({ value, onChange }) {
  const [sugestoes, setSugestoes] = useState([]);

  async function buscarSugestoes(texto) {
    if (texto.length < 3) {
      setSugestoes([]);
      return;
    }
    try {
      const resp = await fetch(`http://localhost:3000/geocode?q=${encodeURIComponent(texto)}`);
      const data = await resp.json();
      setSugestoes(data);
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value.display_name}
        onChange={e => {
          const texto = e.target.value;
          buscarSugestoes(texto);
          onChange({ display_name: texto, lat: null, lon: null });
        }}
        placeholder="Digite o endereço"
      />
      {sugestoes.length > 0 && (
        <ul style={{
          position: "absolute",
          background: "#fff",
          border: "1px solid #ccc",
          width: "100%",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 1000,
          listStyle: "none",
          padding: 0,
          margin: "2px 0 0 0"
        }}>
          {sugestoes.map((s, i) => (
            <li
              key={i}
              style={{ padding: "5px", cursor: "pointer" }}
              onClick={() => {
                onChange({
                  display_name: s.display_name,
                  lat: parseFloat(s.lat),
                  lon: parseFloat(s.lon)
                });
                setSugestoes([]);
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EnderecoInput;
