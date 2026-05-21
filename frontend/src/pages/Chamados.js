import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTecnicosPorRegiao, getAnalistas, criarVisita, atualizarVisita, getGeocodeEndereco } from "../services/api";
import EnderecoInput from "../components/EnderecoInput";
import "../styles/Chamados.css";

function Chamados() {
  const location = useLocation();
  const prefill = location.state || {};

  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);
  const [dataAgendamento, setDataAgendamento] = useState(prefill.data_agendamento || "");
  const [tecnicoId, setTecnicoId] = useState(prefill.tecnico_id || "");
  const [analistaId, setAnalistaId] = useState(prefill.analista_id || "");
  const [regiao, setRegiao] = useState(prefill.regiao || "");
  const [zona, setZona] = useState(prefill.zona || "");
  const [empresa, setEmpresa] = useState(prefill.empresa || "");
  const [endereco, setEndereco] = useState({
    cep: prefill.cep || "",
    endereco: prefill.endereco || "",
    numero: prefill.numero || "",
    cidade: prefill.cidade || "",
    estado: prefill.estado || "",
    display_name: "",
    lat: prefill.latitude || null,
    lon: prefill.longitude || null
  });

  useEffect(() => {
    getAnalistas().then(setAnalistas);
  }, []);

  useEffect(() => {
    if (regiao) {
      getTecnicosPorRegiao(regiao).then(setTecnicos);
      if (!prefill.tecnico_id) setTecnicoId("");
    } else {
      setTecnicos([]);
      setTecnicoId("");
    }
  }, [regiao, prefill.tecnico_id]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!regiao) {
      alert("Selecione a região antes de salvar!");
      return;
    }

    const enderecoCompleto = `${endereco.endereco}, ${endereco.numero} - ${endereco.cidade}/${endereco.estado}, ${endereco.cep}`;

    let lat = endereco.lat;
    let lon = endereco.lon;

    if (!lat || !lon) {
      try {
        const resultados = await getGeocodeEndereco(enderecoCompleto);
        const resultadoValido = resultados.find(
          r =>
            r.display_name &&
            r.display_name.toLowerCase().includes(endereco.cidade.toLowerCase())
        );
        if (resultadoValido) {
          lat = parseFloat(resultadoValido.lat);
          lon = parseFloat(resultadoValido.lon);
        }
      } catch (err) {
        console.error("Erro ao buscar coordenadas:", err);
      }
    }

    const payload = {
      data_agendamento: dataAgendamento,
      tecnico_id: tecnicoId,
      analista_id: analistaId,
      regiao,
      zona,
      empresa,
      cep: endereco.cep,
      endereco: enderecoCompleto,
      latitude: lat,
      longitude: lon,
      status: "agendado"
    };

    try {
      if (prefill.id) {
        // edição
        await atualizarVisita(prefill.id, payload);
        alert("Visita atualizada com sucesso!");
      } else {
        // criação
        await criarVisita(payload);
        alert("Visita criada com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao salvar visita:", err);
      alert("Erro ao salvar visita. Veja o console para detalhes.");
    }

    // limpar campos
    setDataAgendamento("");
    setTecnicoId("");
    setAnalistaId("");
    setRegiao("");
    setZona("");
    setEmpresa("");
    setEndereco({
      cep: "",
      endereco: "",
      numero: "",
      cidade: "",
      estado: "",
      display_name: "",
      lat: null,
      lon: null
    });
  }

  return (
    <div className="chamados-container">
      <h2 className="chamados-title">
        {prefill.id ? "Editar Visita Técnica" : "Agendar Visita Técnica"}
      </h2>
      <form onSubmit={handleSubmit} className="chamados-form">
        <div className="form-grid">
          <label>
            Data da visita:
            <input type="date" value={dataAgendamento} onChange={e => setDataAgendamento(e.target.value)} />
          </label>

          <label>
            Região:
            <select value={regiao} onChange={e => setRegiao(e.target.value)} required>
              <option value="">Selecione a região</option>
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Curitiba</option>
            </select>
          </label>

          <label>
            Técnico:
            <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} required>
              <option value="">Selecione o técnico</option>
              {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </label>

          <label>
            Analista:
            <select value={analistaId} onChange={e => setAnalistaId(e.target.value)}>
              <option value="">Selecione o analista</option>
              {analistas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </label>

          <label>
            Zona:
            <select value={zona} onChange={e => setZona(e.target.value)}>
              <option value="">Selecione a zona</option>
              {[...Array(9)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
          </label>

          <label>
            Empresa:
            <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} />
          </label>

          <label className="endereco-field">
            Endereço:
            <EnderecoInput value={endereco} onChange={setEndereco} />
          </label>
        </div>

        <button type="submit" className="chamados-button">
          {prefill.id ? "Salvar Alterações" : "Agendar"}
        </button>
      </form>
    </div>
  );
}

export default Chamados;
