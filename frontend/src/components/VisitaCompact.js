import React, { useState } from "react";

function VisitaCompact({ zona, endereco }) {
  const [ns, setNs] = useState("");
  const [contato, setContato] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");

  const texto = `
Nº DA ZONA: ${zona || "—"}
NS: ${ns || "—"}
ENDEREÇO: ${endereco || "—"}
PERÍODO: Comercial
CONTATO: ${contato || "—"}
Nome do responsável: ${responsavel || "—"}
OBSERVAÇÃO: ${observacao || "—"}
  `;

  const copiar = () => {
    navigator.clipboard.writeText(texto);
    alert("Registro copiado!");
  };

  return (
    <div style={{ borderTop: "1px solid #ccc", marginTop: "20px", paddingTop: "10px" }}>
      <h3>Modelo de Visita Técnica</h3>

      <div style={{ display: "grid", gap: "8px" }}>
        <label>NS: <input value={ns} onChange={e => setNs(e.target.value)} /></label>
        <label>Contato: <input value={contato} onChange={e => setContato(e.target.value)} /></label>
        <label>Responsável: <input value={responsavel} onChange={e => setResponsavel(e.target.value)} /></label>
        <label>Observação: <textarea value={observacao} onChange={e => setObservacao(e.target.value)} /></label>
      </div>

      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", marginTop: "10px" }}>
        {texto}
      </pre>

      <button onClick={copiar} style={{ marginTop: "10px" }}>Copiar Registro</button>
    </div>
  );
}

export default VisitaCompact;
