import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import { getVisitas, getGeocodeEndereco } from "../services/api";
import { formatarEndereco } from "../utils/formatarEndereco";
import "leaflet/dist/leaflet.css";

// ícones coloridos
const redIcon = new L.Icon({ iconUrl: "...red.png", shadowUrl: "...shadow.png", iconSize: [25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowSize:[41,41] });
const blueIcon = new L.Icon({ iconUrl: "...blue.png", shadowUrl: "...shadow.png", iconSize: [25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowSize:[41,41] });
const greenIcon = new L.Icon({ iconUrl: "...green.png", shadowUrl: "...shadow.png", iconSize: [25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowSize:[41,41] });
const orangeIcon = new L.Icon({ iconUrl: "...orange.png", shadowUrl: "...shadow.png", iconSize: [25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowSize:[41,41] });

// componente auxiliar para mudar a visão do mapa
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 10);
  return null;
}

// função para buscar rota via OpenRouteService
async function buscarRota(lat1, lon1, lat2, lon2) {
  const apiKey = "SUA_CHAVE_AQUI"; // gere em openrouteservice.org
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lon1},${lat1}&end=${lon2},${lat2}`;

  const resp = await fetch(url);
  const data = await resp.json();

  const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
  const distanciaKm = data.features[0].properties.segments[0].distance / 1000;
  const duracaoMin = data.features[0].properties.segments[0].duration / 60;

  return { coords, distanciaKm, duracaoMin };
}

function Mapa() {
  const [center, setCenter] = useState([-23.5505, -46.6333]); // São Paulo inicial
  const [visitas, setVisitas] = useState([]);
  const [dataFiltro, setDataFiltro] = useState("");
  const [enderecoBusca, setEnderecoBusca] = useState("");
  const [tecnicoProximo, setTecnicoProximo] = useState(null);
  const [rota, setRota] = useState(null);

  const iconesTecnicos = {
    "Carlos Pereira": redIcon,
    "Fernanda Lima": blueIcon,
    "Ana Costa": greenIcon,
    "Beatriz Gomes": orangeIcon
  };

  useEffect(() => {
    async function carregarVisitas() {
      const dados = await getVisitas();
      setVisitas(dados);
    }
    carregarVisitas();
  }, []);

  const visitasFiltradas = dataFiltro
    ? visitas.filter((v) => {
        const dataVisita = new Date(v.data_agendamento).toISOString().split("T")[0];
        return dataVisita === dataFiltro;
      })
    : visitas;

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
      let rotaCoords = null;

      for (const v of visitas) {
        if (v.latitude && v.longitude) {
          const rotaData = await buscarRota(latAlvo, lonAlvo, v.latitude, v.longitude);
          if (rotaData.distanciaKm < menorDistancia) {
            menorDistancia = rotaData.distanciaKm;
            tecnicoMaisProximo = v.tecnico;
            rotaCoords = rotaData.coords;
          }
        }
      }

      setTecnicoProximo({ nome: tecnicoMaisProximo, distancia: menorDistancia.toFixed(2) });
      setRota(rotaCoords);
    } catch (err) {
      console.error("Erro ao buscar técnico mais próximo:", err);
    }
  }

  return (
    <div style={{ display: "flex", height: "70vh", width: "100%" }}>
      <div style={{ flex: 3 }}>
        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={center} />

          {visitasFiltradas.map((v, i) =>
            v.latitude && v.longitude ? (
              <Marker key={i} position={[v.latitude, v.longitude]} icon={iconesTecnicos[v.tecnico] || blueIcon}>
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

          {rota && <Polyline positions={rota} color="purple" />}
        </MapContainer>
      </div>

      <div style={{ flex: 1, padding: "15px" }}>
        <h3>Legenda de Técnicos</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(iconesTecnicos).map(([nome, icon]) => (
            <li key={nome} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
              <span style={{
                width: "16px", height: "16px",
                backgroundColor: icon.options.iconUrl.includes("red") ? "red" :
                                icon.options.iconUrl.includes("blue") ? "blue" :
                                icon.options.iconUrl.includes("green") ? "green" :
                                icon.options.iconUrl.includes("orange") ? "orange" : "gray",
                display: "inline-block", marginRight: "8px"
              }}></span>
              {nome}
            </li>
          ))}
        </ul>

        <h3>Selecionar cidade</h3>
        <button onClick={() => setCenter([-23.5505, -46.6333])}>São Paulo</button>
        <button onClick={() => setCenter([-25.4284, -49.2733])}>Curitiba</button>
        <button onClick={() => setCenter([-22.9068, -43.1729])}>Rio de Janeiro</button>

        <h3>Filtrar por data</h3>
        <input type="date" value={dataFiltro} onChange={(e) => setDataFiltro(e.target.value)} />

        <h3 style={{ marginTop: "20px" }}>Buscar técnico mais próximo</h3>
        <input type="text" placeholder="Digite o endereço" value={enderecoBusca} onChange={e => setEnderecoBusca(e.target.value)} />
        <button onClick={buscarTecnicoMaisProximo}>Buscar</button>

        {tecnicoProximo && (
          <p style={{ marginTop: "10px" }}>
            Técnico mais próximo: <strong>{tecnicoProximo.nome}</strong><br/>
            Distância de carro: {tecnicoProximo.distancia} km
          </p>
        )}
      </div>
    </div>
  );
}

export default Mapa;
