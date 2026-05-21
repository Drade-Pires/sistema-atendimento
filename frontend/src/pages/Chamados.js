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

  // inicializa todos os campos com prefill
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
    } else {
      setTecnicos([]);
      setTecnicoId("");
    }
  }, [regiao]);

  async function handleSubmit(e) {
    e.preventDefault();

    const enderecoCompleto = `${endereco.endereco}, ${endereco.numero} - ${endereco.cidade}/${endereco.estado}, ${endereco.cep}`;
    let lat = endereco.lat;
    let lon = endereco.lon;

    if (!lat || !lon) {
      try {
        const resultados = await getGeocodeEndereco(enderecoCompleto);
        const resultadoValido = resultados.find(r =>
          r.display_name && r.display_name.toLowerCase().includes(endereco.cidade.toLowerCase())
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
        await atualizarVisita(prefill.id, payload);
        alert("Visita atualizada com sucesso!");
      } else {
        await criarVisita(payload);
        alert("Visita criada com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao salvar visita:", err);
      alert("Erro ao salvar visita. Veja o console para detalhes.");
    }
  }

  return (
    <div className="chamados-container">
      <h2 className="chamados-title">
        {prefill.id ? "Editar Visita Técnica" : "Agendar Visita Técnica"}
      </h2>
      <form onSubmit={handleSubmit} className="chamados-form">
        {/* todos os inputs já começam com os valores de prefill */}
        {/* ... resto do formulário igual ao seu */}
      </form>
    </div>
  );
}

export default Chamados;
