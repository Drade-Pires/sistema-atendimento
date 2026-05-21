import React, { useState, useEffect } from "react";
import { getVisitas, criarVisita, atualizarVisita, excluirVisita, getTecnicos, getAnalistas, getGeocodeEndereco } from "../services/api";
import "../styles/Agenda.css";

function Agenda() {
  const [visitas, setVisitas] = useState([]);
  const [editVisita, setEditVisita] = useState(null);
  const [novaVisita, setNovaVisita] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);

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

  async function salvarNovaVisita() {
    try {
      if (!novaVisita.empresa || !novaVisita.endereco || !novaVisita.numero || !novaVisita.regiao) {
        alert("Preencha todos os campos obrigatórios antes de salvar");
        return;
      }

      const enderecoCompleto = `${novaVisita.endereco}, ${novaVisita.numero} - ${novaVisita.regiao}, ${novaVisita.cep}`;

      let lat = novaVisita.latitude;
      let lon = novaVisita.longitude;

      if (!lat || !lon) {
        try {
          const resultados = await getGeocodeEndereco(enderecoCompleto);
          if (resultados && resultados.length > 0) {
            lat = parseFloat(resultados[0].lat);
            lon = parseFloat(resultados[0].lon);
          }
        } catch (err) {
          console.error("Erro ao buscar coordenadas:", err);
        }
      }

      const visitaFinal = {
        ...novaVisita,
        endereco: enderecoCompleto,
        latitude: lat,
        longitude: lon,
        status: "agendado"
      };

      console.log("Payload enviado:", visitaFinal);

      const res = await criarVisita(visitaFinal);
      console.log("Resposta da API:", res);

      setNovaVisita(null);
      carregarDados();
    } catch (err) {
      console.error("Erro ao salvar visita:", err);
      alert("Erro ao salvar visita. Veja o console para detalhes.");
    }
  }

  async function removerVisita(id) {
    await excluirVisita(id);
    carregarDados();
  }

  const visitasFiltradas = visitas.filter(v => {
    let ok = true;
    if (dataFiltro) {
      const dataVisita = new Date(v.data_agendamento).toLocaleDateString("pt-BR", { timeZone: "UTC" });
      const filtroFormatado = new Date(dataFiltro).toLocaleDateString("pt-BR", { timeZone: "UTC" });
      ok = ok && dataVisita === filtroFormatado;

    }
    if (regiaoFiltro) {
      ok = ok && v.regiao === regiaoFiltro;
    }
    return ok;
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
          <h3>
            {tecnicoNome} — {lista.length} visitas
            <button
              className="agendar-btn"
              onClick={() => setNovaVisita({
                tecnico_id: tecnicos.find(t => t.nome === tecnicoNome)?.id,
                data_agendamento: dataFiltro,
                regiao: regiaoFiltro || "São Paulo",
                zona: "",
                empresa: "",
                endereco: "",
                cep: "",
                numero: "",
                analista_id: "",
                status: "agendado"
              })}
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

      {novaVisita && (
        <div className="modal">
          <div>
            <h3>Agendar Nova Visita</h3>
            <input
              type="date"
              value={novaVisita.data_agendamento}
              onChange={e => setNovaVisita({ ...novaVisita, data_agendamento: e.target.value })}
            />
            <select
              value={novaVisita.tecnico_id}
              onChange={e => setNovaVisita({ ...novaVisita, tecnico_id: parseInt(e.target.value) })}
            >
              {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            <select
              value={novaVisita.analista_id}
              onChange={e => setNovaVisita({ ...novaVisita, analista_id: parseInt(e.target.value) })}
            >
              <option value="">Selecione o analista</option>
              {analistas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select
              value={novaVisita.zona}
              onChange={e => setNovaVisita({ ...novaVisita, zona: e.target.value })}
            >
              {[...Array(9)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
            <select
              value={novaVisita.regiao}
              onChange={e => setNovaVisita({ ...novaVisita, regiao: e.target.value })}
            >
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Curitiba</option>
            </select>
            <input
              type="text"
              placeholder="CEP"
              value={novaVisita.cep || ""}
              onChange={async e => {
                const cep = e.target.value;
                setNovaVisita({ ...novaVisita, cep });
                if (cep.length === 8) {
                  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                  const dados = await res.json();
                  if (!dados.erro) {
                    setNovaVisita({
                      ...novaVisita,
                      cep,
                      endereco: `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`
                    });
                  }
                }
              }}
            />
            <input
              type="text"
              placeholder="Número"
              value={novaVisita.numero || ""}
              onChange={e => setNovaVisita({ ...novaVisita, numero: e.target.value })}
            />
            <input
              type="text"
              placeholder="Endereço completo"
              value={novaVisita.endereco || ""}
              onChange={e => setNovaVisita({ ...novaVisita, endereco: e.target.value })}
            />
            <input
              type="text"
              placeholder="Empresa"
              value={novaVisita.empresa}
              onChange={e => setNovaVisita({ ...novaVisita, empresa: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={salvarNovaVisita}>Salvar</button>
              <button onClick={() => setNovaVisita(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agenda;

//