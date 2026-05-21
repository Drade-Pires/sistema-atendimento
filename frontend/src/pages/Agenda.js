import React, { useState, useEffect } from "react";
import { getVisitas, atualizarVisita, excluirVisita, getTecnicos, getAnalistas } from "../services/api";
import "../styles/Agenda.css";

function Agenda() {
  const [visitas, setVisitas] = useState([]);
  const [editVisita, setEditVisita] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);

  // inicia já com a data de hoje e região padrão
  const hoje = new Date().toISOString().split("T")[0];
  const [dataFiltro, setDataFiltro] = useState(hoje);
  const [regiaoFiltro, setRegiaoFiltro] = useState("São Paulo");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const v = await getVisitas();
    setVisitas(v);
    setTecnicos(await getTecnicos());
    setAnalistas(await getAnalistas());
  }

  async function salvarEdicao() {
    await atualizarVisita(editVisita.id, editVisita);
    setEditVisita(null);
    carregarDados();
  }

  async function removerVisita(id) {
    await excluirVisita(id);
    carregarDados();
  }

  // aplica filtro de data e região
  const visitasFiltradas = visitas.filter(v => {
    let ok = true;

    if (dataFiltro) {
      const dataVisita = new Date(v.data_agendamento).toISOString().split("T")[0];
      ok = ok && dataVisita === dataFiltro;
    }

    if (regiaoFiltro) {
      ok = ok && v.regiao === regiaoFiltro;
    }

    return ok;
  });

  // agrupa por técnico
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
        <input
          type="date"
          value={dataFiltro}
          onChange={e => setDataFiltro(e.target.value)}
        />

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
          <h3>{tecnicoNome} — {lista.length} visitas</h3>
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
                  <td>{new Date(v.data_agendamento).toLocaleDateString("pt-BR")}</td>
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

      {editVisita && (
        <div className="modal">
          <div>
            <h3>Editar Visita</h3>
            <input
              type="date"
              value={editVisita.data_agendamento.split("T")[0]}
              onChange={e => setEditVisita({ ...editVisita, data_agendamento: e.target.value })}
            />
            <select
              value={editVisita.tecnico_id}
              onChange={e => setEditVisita({ ...editVisita, tecnico_id: parseInt(e.target.value) })}
            >
              {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            <select
              value={editVisita.analista_id}
              onChange={e => setEditVisita({ ...editVisita, analista_id: parseInt(e.target.value) })}
            >
              {analistas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select
              value={editVisita.zona}
              onChange={e => setEditVisita({ ...editVisita, zona: e.target.value })}
            >
              {[...Array(9)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select
              value={editVisita.regiao}
              onChange={e => setEditVisita({ ...editVisita, regiao: e.target.value })}
            >
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Curitiba</option>
            </select>
            <input
              type="text"
              value={editVisita.empresa}
              onChange={e => setEditVisita({ ...editVisita, empresa: e.target.value })}
            />
            <input
              type="text"
              value={editVisita.endereco}
              onChange={e => setEditVisita({ ...editVisita, endereco: e.target.value })}
            />
            <button onClick={salvarEdicao}>Salvar</button>
            <button onClick={() => setEditVisita(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agenda;
