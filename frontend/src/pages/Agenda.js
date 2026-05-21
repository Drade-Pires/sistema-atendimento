import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVisitas, excluirVisita, getTecnicos, getAnalistas } from "../services/api";
import "../styles/Agenda.css";

function Agenda() {
  const [visitas, setVisitas] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);
  const hoje = new Date().toISOString().split("T")[0];
  const [dataFiltro, setDataFiltro] = useState(hoje);
  const [regiaoFiltro, setRegiaoFiltro] = useState("São Paulo");

  const navigate = useNavigate();

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    setVisitas(await getVisitas());
    setTecnicos(await getTecnicos());
    setAnalistas(await getAnalistas());
  }

  async function removerVisita(id) {
    await excluirVisita(id);
    carregarDados();
  }

  const visitasFiltradas = visitas.filter(v => {
    const dataVisita = new Date(v.data_agendamento).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const filtroFormatado = new Date(dataFiltro).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    return (!dataFiltro || dataVisita === filtroFormatado) && (!regiaoFiltro || v.regiao === regiaoFiltro);
  });

  const visitasPorTecnico = visitasFiltradas.reduce((acc, v) => {
    const tecnicoNome = tecnicos.find(t => t.id === v.tecnico_id)?.nome || v.tecnico || "Sem técnico";
    if (!acc[tecnicoNome]) acc[tecnicoNome] = [];
    acc[tecnicoNome].push(v);
    return acc;
  }, {});

  return (
    <div className="agenda-container">
      <h2>Visitas Técnicas</h2>

      <div className="filtros">
        <label>Filtrar por data: </label>
        <input type="date" value={dataFiltro} onChange={e => setDataFiltro(e.target.value)} />
        <label>Filtrar por região: </label>
        <select value={regiaoFiltro} onChange={e => setRegiaoFiltro(e.target.value)}>
          <option value="">Todas</option>
          <option>São Paulo</option>
          <option>Rio de Janeiro</option>
          <option>Curitiba</option>
        </select>
      </div>

      {Object.entries(visitasPorTecnico).map(([tecnicoNome, lista]) => (
        <div key={tecnicoNome} className="tecnico-card">
          <h3>
            {tecnicoNome} — {lista.length} visitas
            <button
              className="agendar-btn"
              onClick={() => {
                const tecnicoId = tecnicos.find(t => t.nome === tecnicoNome)?.id;
                navigate("/chamados", {
                  state: {
                    tecnico_id: tecnicoId,
                    data_agendamento: dataFiltro,
                    regiao: regiaoFiltro || "São Paulo"
                  }
                });
              }}
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
                    <button onClick={() => navigate("/chamados", { state: { ...v } })}>Editar</button>
                    <button onClick={() => removerVisita(v.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Agenda;
