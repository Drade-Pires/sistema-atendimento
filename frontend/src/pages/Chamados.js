import React, { useState, useEffect } from "react";
import { getTecnicos, getAnalistas, criarVisita } from "../services/api";
import EnderecoInput from "../components/EnderecoInput";
import "../styles/Chamados.css";

function Chamados() {
  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [tecnicoId, setTecnicoId] = useState("");
  const [analistaId, setAnalistaId] = useState("");
  const [zona, setZona] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [endereco, setEndereco] = useState({ display_name: "", lat: null, lon: null });


  useEffect(() => {
    getTecnicos().then(setTecnicos);
    getAnalistas().then(setAnalistas);
  }, []);

  async function handleSubmit(e) {
  e.preventDefault();
  await criarVisita({
    data_agendamento: dataAgendamento,
    tecnico_id: tecnicoId,
    analista_id: analistaId,
    zona,
    empresa,
    endereco: endereco.display_name,   // texto do endereço
    latitude: endereco.lat,            // coordenada
    longitude: endereco.lon,           // coordenada
    status: "agendado"
  });
  // limpar campos
  setDataAgendamento(""); setTecnicoId(""); setAnalistaId("");
  setZona(""); setEmpresa("");
  setEndereco({ display_name: "", lat: null, lon: null });
}


  return (
    <div className="chamados-container">
      <h2 className="chamados-title">Agendar Visita Técnica</h2>
      <form onSubmit={handleSubmit} className="chamados-form">

        <label>Data da visita:
          <input type="date" value={dataAgendamento} onChange={e => setDataAgendamento(e.target.value)} />
        </label>

        <label>Técnico:
          <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)}>
            <option value="">Selecione o técnico</option>
            {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </label>

        <label>Analista:
          <select value={analistaId} onChange={e => setAnalistaId(e.target.value)}>
            <option value="">Selecione o analista</option>
            {analistas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
        </label>

        <label>Zona:
          <select value={zona} onChange={e => setZona(e.target.value)}>
            <option value="">Selecione a zona</option>
            {[...Array(9)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </label>

        <label>Empresa:
          <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} />
        </label>

        <label>Endereço:
          <EnderecoInput value={endereco} onChange={setEndereco} />
        </label>

        <button type="submit" className="chamados-button">Agendar</button>
      </form>
    </div>
  );
}

export default Chamados;
