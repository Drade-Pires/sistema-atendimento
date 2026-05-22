import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTecnicosPorRegiao, getAnalistas, criarVisita, atualizarVisita, getGeocodeEndereco } from "../services/api";
import EnderecoInput from "../components/EnderecoInput";
import "../styles/Chamados.css";

function Chamados() {
  const location = useLocation();
  const prefill = location.state || {};

  // 🔎 Faz parse do endereço completo se os campos separados não vierem
  let cep = prefill.cep || "";
  let enderecoRua = prefill.endereco || "";
  let numero = prefill.numero || "";
  let cidade = prefill.cidade || "";
  let estado = prefill.estado || "";

  if (prefill.endereco && (!cep || !cidade || !estado)) {
    try {
      const partes = prefill.endereco.split(",");
      // exemplo: "Rua Corruíra, 204 - Araucária/PR, 83706350"
      if (partes.length >= 2) {
        const ruaENumero = partes[0]; // "Rua Corruíra"
        const cidadeEstado = partes[1].split("-")[1]?.split("/") || [];
        cep = partes[2] ? partes[2].trim() : "";

        enderecoRua = partes[0].split("-")[0].trim();
        numero = partes[0].split(",")[1]?.trim() || "";
        cidade = cidadeEstado[0]?.trim() || "";
        estado = cidadeEstado[1]?.trim() || "";
      }
    } catch (err) {
      console.warn("Não foi possível parsear endereço:", err);
    }
  }

  const [tecnicos, setTecnicos] = useState([]);
  const [analistas, setAnalistas] = useState([]);

  const [dataAgendamento, setDataAgendamento] = useState(
    prefill.data_agendamento
      ? new Date(prefill.data_agendamento).toISOString().split("T")[0]
      : ""
  );
  const [tecnicoId, setTecnicoId] = useState(prefill.tecnico_id || "");
  const [analistaId, setAnalistaId] = useState(prefill.analista_id || "");
  const [regiao, setRegiao] = useState(prefill.regiao || "");
  const [zona, setZona] = useState(prefill.zona || "");
  const [empresa, setEmpresa] = useState(prefill.empresa || "");
  const [endereco, setEndereco] = useState({
    cep,
    endereco: enderecoRua,
    numero,
    cidade,
    estado,
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
    }
  }, [regiao]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!regiao) {
      alert("Selecione a região antes de salvar!");
      return;
    }

    const enderecoCompleto = `${endereco.endereco}, ${endereco.numero} - ${endereco.cidade}/${endereco.estado}, ${endereco.cep}`;
    let lat = endereco.lat;
    let lon = endereco.lon;

    if (!lat || !lon || enderecoCompleto !== prefill.endereco) {
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
      data_agendamento: dataAgendamento || "",
      tecnico_id: tecnicoId,
      analista_id: analistaId,
      regiao,
      zona,
      empresa,
      cep: endereco.cep,
      endereco: enderecoCompleto,
      latitude: lat ?? 0,
      longitude: lon ?? 0,
      status: "agendado"
    };

    try {
      console.log("Payload enviado:", payload);
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
        <div className="form-grid">
          {/* ... seus inputs continuam iguais ... */}
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
