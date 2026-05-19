import React, { useState, useEffect } from "react";
import { getVisitas, atualizarVisita, excluirVisita, getTecnicos, getAnalistas } from "../services/api";
import "../styles/Agenda.css";

function Agenda() {
  const [visitas, setVisitas] = useState([]);
  const [editVisita, setEditVisita] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);

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

  return (
    <div className="agenda-container">
      <h2>Visitas Técnicas</h2>
      <table className="agenda-table">
        <thead>
          <tr>
            <th>Data</th><th>Técnico</th><th>Analista</th>
            <th>Zona</th><th>Empresa</th><th>Endereço</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {visitas.map(v => (
            <tr key={v.id}>
              <td>{new Date(v.data_agendamento).toLocaleDateString()}</td>
              <td>{v.tecnico}</td>
              <td>{v.analista}</td>
              <td>{v.zona}</td>
              <td>{v.empresa}</td>
              <td>{v.endereco}</td>
              <td>
                <button onClick={() => setEditVisita(v)}>Editar</button>
                <button onClick={() => removerVisita(v.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editVisita && (
        <div className="modal">
          <h3>Editar Visita</h3>
          <input type="date"
            value={editVisita.data_agendamento.split("T")[0]}
            onChange={e => setEditVisita({ ...editVisita, data_agendamento: e.target.value })}
          />
          <select
            value={editVisita.tecnico_id}
            onChange={e => setEditVisita({ ...editVisita, tecnico_id: e.target.value })}
          >
            {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          <select
            value={editVisita.analista_id}
            onChange={e => setEditVisita({ ...editVisita, analista_id: e.target.value })}
          >
            {analistas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
          <select
            value={editVisita.zona}
            onChange={e => setEditVisita({ ...editVisita, zona: e.target.value })}
          >
            {[...Array(9)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
          <input type="text"
            value={editVisita.empresa}
            onChange={e => setEditVisita({ ...editVisita, empresa: e.target.value })}
          />
          <input type="text"
            value={editVisita.endereco}
            onChange={e => setEditVisita({ ...editVisita, endereco: e.target.value })}
          />
          <button onClick={salvarEdicao}>Salvar</button>
          <button onClick={() => setEditVisita(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default Agenda;
