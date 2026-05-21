import React from "react";

function VisitaList({ visitasPorTecnico, tecnicos, analistas, setNovaVisita, setEditVisita, removerVisita, dataFiltro, regiaoFiltro }) {
  return (
    <>
      {Object.entries(visitasPorTecnico).map(([tecnicoNome, lista]) => (
        <div key={tecnicoNome} className="tecnico-card">
          <h3>
            {tecnicoNome} — {lista.length} visitas
            <button
              className="agendar-btn"
              onClick={() =>
                setNovaVisita({
                  tecnico_id: tecnicos.find(t => t.nome === tecnicoNome)?.id,
                  data_agendamento: dataFiltro,
                  regiao: regiaoFiltro || "São Paulo",
                  zona: "",
                  empresa: "",
                  endereco: "",
                  cep: "",
                  numero: "",
                  cidade: "",
                  estado: "",
                  analista_id: "",
                  status: "agendado"
                })
              }
            >
              Agendar
            </button>
          </h3>
          <table className="agenda-table">
            <thead>
              <tr>
                <th>Data</th><th>Analista</th><th>Zona</th>
                <th>Empresa</th><th>Endereço</th><th>Região</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(v => (
                <tr key={v.id}>
                  <td>{new Date(v.data_agendamento).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                  <td>{analistas.find(a => a.id === v.analista_id)?.nome || v.analista}</td>
                  <td>{v.zona}</td>
                  <td>{v.empresa}</td>
                  <td>{v.endereco}</td>
                  <td>{v.regiao}</td>
                  <td>
                    <button onClick={() => setEditVisita(v)}>Editar</button>
                    <button onClick={() => removerVisita(v.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

export default VisitaList;
