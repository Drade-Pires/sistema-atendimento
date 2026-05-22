import React, { useState, useEffect } from "react";

function VisitaPreview({ zona, endereco }) {
  const [ns, setNs] = useState("");
  const [contato, setContato] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacao, setObservacao] = useState("");

  // sempre que zona ou endereço mudarem no formulário, atualiza aqui
  useEffect(() => {
    setNs("");
    setContato("");
    setResponsavel("");
    setObservacao("");
  }, [zona, endereco]);

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
    alert("Modelo copiado para área de transferência!");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h3>Pré-visualização da Visita</h3>

      <label>
        NS:
        <input type="text" value={ns} onChange={e => setNs(e.target.value)} />
      </label>
      <br />

      <label>
        Contato:
        <input type="text" value={contato} onChange={e => setContato(e.target.value)} />
      </label>
      <br />

      <label>
        Responsável:
        <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
      </label>
      <br />

      <label>
        Observação:
        <textarea value={observacao} onChange={e => setObservacao(e.target.value)} />
      </label>

      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", marginTop: "10px" }}>
        {texto}
      </pre>

      <button onClick={copiar} style={{ marginTop: "10px" }}>Copiar</button>
    </div>
  );
}

export default VisitaPreview;
