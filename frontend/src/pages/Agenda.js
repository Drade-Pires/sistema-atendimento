import React, { useState, useEffect } from "react";
import {
  getVisitas,
  criarVisita,
  atualizarVisita,
  excluirVisita,
  getTecnicos,
  getAnalistas,
  getGeocodeEndereco
} from "../services/api";
import { validarVisita, formatarEndereco, buscarCoordenadas } from "../utils/helpers";
import VisitaForm from "../components/VisitaForm";
import "../styles/Agenda.css";

function Agenda() {
  const [visitas, setVisitas] = useState([]);
  const [editVisita, setEditVisita] = useState(null);
  const [novaVisita, setNovaVisita] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

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

  return (
    <div className="agenda-container">
      <h2>Visitas Técnicas</h2>

      <table className="agenda-table">
        <thead>
          <tr>
            <th>Data</th><th>Analista</th><th>Zona</th>
            <th>Empresa</th><th>Endereço</th><th>Região</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {visitas.map(v => (
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

      <button
        className="agendar-btn"
        onClick={() =>
          setNovaVisita({
            tecnico_id: "",
            data_agendamento: new Date().toISOString().split("T")[0],
            regiao: "São Paulo",
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
        Agendar Nova
      </button>

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
