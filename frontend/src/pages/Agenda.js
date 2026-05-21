import React, { useState, useEffect } from "react";
import { getVisitas, criarVisita, atualizarVisita, excluirVisita, getTecnicos, getAnalistas, getGeocodeEndereco } from "../services/api";
import { validarVisita, formatarEndereco, buscarCoordenadas } from "../utils/helpers";
import VisitaForm from "../components/VisitaForm";
import VisitaList from "../components/VisitaList";
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

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    setVisitas(await getVisitas());
    setTecnicos(await getTecnicos());
    setAnalistas(await getAnalistas());
  }

  async function salvar(visita, isEdit = false) {
    if (!validarVisita(visita)) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    const enderecoCompleto = formatarEndereco(visita);
    let { lat, lon } = visita;
    if (!lat || !lon) ({ lat, lon } = await buscarCoordenadas(getGeocodeEndereco, enderecoCompleto, visita.cidade));

    const payload = {
      ...visita,
      tecnico_id: parseInt(visita.tecnico_id),
      analista_id: parseInt(visita.analista_id),
      endereco: enderecoCompleto,
      latitude: lat,
      longitude: lon,
      status: "agendado"
    };

    if (isEdit) await atualizarVisita(visita.id, payload);
    else await criarVisita(payload);

    setEditVisita(null);
    setNovaVisita(null);
    carregarDados();
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

      <VisitaList
        visitasPorTecnico={visitasPorTecnico}
        tecnicos={tecnicos}
        analistas={analistas}
        setNovaVisita={setNovaVisita}
        setEditVisita={setEditVisita}
        removerVisita={removerVisita}
        dataFiltro={dataFiltro}
        regiaoFiltro={regiaoFiltro}
      />

      {editVisita && (
        <VisitaForm
          visita={editVisita}
          setVisita={setEditVisita}
          tecnicos={tecnicos}
          analistas={analistas}
          onSave={() => salvar(editVisita, true)}
          onCancel={() => setEditVisita(null)}
        />
      )}

      {novaVisita && (
        <VisitaForm
          visita={novaVisita}
          setVisita={setNovaVisita}
          tecnicos={tecnicos}
          analistas={analistas}
          onSave={() => salvar(novaVisita, false)}
          onCancel={() => setNovaVisita(null)}
        />
      )}
    </div>
  );
}

export default Agenda;
