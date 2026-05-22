import React from "react";

function VisitaPreview({ chamado }) {
  if (!chamado) return null;

  const texto = `
Nº DA ZONA: ${chamado.zona || "—"}
NS: ${chamado.ns || "—"}
ENDEREÇO: ${chamado.endereco || "—"}
PERÍODO: ${chamado.periodo || "Comercial"}
CONTATO: ${chamado.contato || "—"}
Nome do responsável: ${chamado.responsavel || "—"}
OBSERVAÇÃO: ${chamado.observacao || "—"}
  `;

  const copiar = () => {
    navigator.clipboard.writeText(texto);
    alert("Modelo copiado para área de transferência!");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h3>Pré-visualização da Visita</h3>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{texto}</pre>
      <button onClick={copiar} style={{ marginTop: "10px" }}>Copiar</button>
    </div>
  );
}

export default VisitaPreview;
