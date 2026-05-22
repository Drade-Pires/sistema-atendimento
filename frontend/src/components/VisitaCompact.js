import React, { useState } from "react";
import "../styles/VisitaCompact.css";

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
  <div className="visita-compact">
    <h3>Modelo para o UNO</h3>

    {/* NS, Contato e Responsável na mesma linha */}
    <div className="linha-campos">
      <label>NS:
        <input value={ns} onChange={e => setNs(e.target.value)} />
      </label>

      <label>Contato:
        <input value={contato} onChange={e => setContato(e.target.value)} />
      </label>

      <label>Responsável:
        <input value={responsavel} onChange={e => setResponsavel(e.target.value)} />
      </label>
    </div>

    {/* Observação ocupa toda a largura */}
    <label className="observacao">Observação:
      <textarea value={observacao} onChange={e => setObservacao(e.target.value)} />
    </label>

    <pre>{texto}</pre>

    <button onClick={copiar}>Copiar Registro</button>
  </div>
);

}

export default VisitaCompact;
