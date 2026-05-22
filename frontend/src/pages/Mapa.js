import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getVisitas, getGeocodeEndereco } from "../services/api";
import { formatarEndereco } from "../utils/formatarEndereco";
import { tecnicosPorRegiao } from "../utils/tecnicosPorRegiao";
import "leaflet/dist/leaflet.css";

// componente auxiliar para mudar a visão do mapa
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 10);
  return null;
}

function Mapa() {
  const [center, setCenter] = useState([-23.5505, -46.6333]); // São Paulo inicial
  const [regiao, setRegiao] = useState("São Paulo");          // região inicial
  const [visitas, setVisitas] = useState([]);
  const hoje = new Date().toISOString().split("T")[0];
  const [dataFiltro, setDataFiltro] = useState(hoje);
  const [enderecoBusca, setEnderecoBusca] = useState("");
  const [tecnicoProximo, setTecnicoProximo] = useState(null);

  // pega os técnicos da região atual
  const iconesTecnicos = tecnicosPorRegiao[regiao] || {};

  useEffect(() => {
    async function carregarVisitas() {
      const dados = await getVisitas();
      setVisitas(Array.isArray(dados) ? dados : []); // garante array
    }
    carregarVisitas();
  }, []);

  const visitasFiltradas = dataFiltro
    ? visitas.filter((v) => {
        const dataVisita = new Date(v.data_agendamento)
          .toISOString()
          .split("T")[0];
        return dataVisita === dataFiltro;
      })
    : visitas;

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async function buscarTecnicoMaisProximo() {
    if (!enderecoBusca) return;
    try {
      const resultados = await getGeocodeEndereco(enderecoBusca);
      const alvo = resultados[0];
      if (!alvo) return;

      const latAlvo = parseFloat(alvo.lat);
      const lonAlvo = parseFloat(alvo.lon);

      let tecnicoMaisProximo = null;
      let menorDistancia = Infinity;

      visitasFiltradas.forEach(v => {
        if (v.latitude && v.longitude) {
          const dist = calcularDistancia(latAlvo, lonAlvo, v.latitude, v.longitude);
          if (dist < menorDistancia) {
            menorDistancia = dist;
            tecnicoMaisProximo = v.tecnico;
          }
        }
      });

      setTecnicoProximo({ nome: tecnicoMaisProximo, distancia: menorDistancia.toFixed(2) });
    } catch (err) {
      console.error("Erro ao buscar técnico mais próximo:", err);
    }
  }

  // ícone padrão caso técnico não esteja listado
  const defaultIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div style={{ display: "flex", height: "70vh", width: "100%" }}>
      <div style={{ flex: 3 }}>
        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={center} />

          {visitasFiltradas.map((v, i) =>
            v.latitude && v.longitude ? (
              <Marker
                key={i}
                position={[v.latitude, v.longitude]}
                icon={iconesTecnicos[v.tecnico] || defaultIcon}
              >
                <Popup>
                  <strong>{v.empresa}</strong><br />
                  Técnico: {v.tecnico}<br />
                  Analista: {v.analista}<br />
                  Endereço: {formatarEndereco(v)}<br />
                  Data: {new Date(v.data_agendamento).toLocaleDateString("pt-BR")}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      <div style={{ flex: 1, padding: "15px" }}>
        <h3>Legenda de Técnicos ({regiao})</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(iconesTecnicos).map(([nome, icon]) => (
            <li key={nome} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor:
                    icon.options.iconUrl.includes("red") ? "red" :
                    icon.options.iconUrl.includes("blue") ? "blue" :
                    icon.options.iconUrl.includes("green") ? "green" :
                    icon.options.iconUrl.includes("orange") ? "orange" : "gray",
                  display: "inline-block",
                  marginRight: "8px"
                }}
              ></span>
              {nome}
            </li>
          ))}
        </ul>

        <h3>Selecionar cidade</h3>
        <button onClick={() => { setCenter([-23.5505, -46.6333]); setRegiao("São Paulo"); }}>São Paulo</button>
        <button onClick={() => { setCenter([-25.4284, -49.2733]); setRegiao("Curitiba"); }}>Curitiba</button>
        <button onClick={() => { setCenter([-22.9068, -43.1729]); setRegiao("Rio de Janeiro"); }}>Rio de Janeiro</button>

        <h3>Filtrar por data</h3>
        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
        />

        <h3 style={{ marginTop: "20px" }}>Buscar técnico mais próximo</h3>
        <input
          type="text"
          placeholder="Digite o endereço"
          value={enderecoBusca}
          onChange={e => setEnderecoBusca(e.target.value)}
        />
        <button onClick={buscarTecnicoMaisProximo}>Buscar</button>

        {tecnicoProximo && (
          <p style={{ marginTop: "10px" }}>
            Técnico mais próximo: <strong>{tecnicoProximo.nome}</strong><br/>
            Distância: {tecnicoProximo.distancia} km
          </p>
        )}
      </div>
    </div>
  );
}

export default Mapa;
