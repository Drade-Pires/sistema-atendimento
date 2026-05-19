import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getVisitas, getGeocode } from "../services/api";
import "leaflet/dist/leaflet.css";

const coresTecnicos = {
  1: "red",
  2: "blue",
  3: "green",
  4: "orange"
};

function getIcon(cor) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

function Mapa() {
  const [visitas, setVisitas] = useState([]);

  useEffect(() => {
    async function carregarVisitas() {
      const dados = await getVisitas();
      console.log("Visitas recebidas:", dados); // debug

      const visitasComCoords = await Promise.all(
        dados.map(async (v) => {
          try {
            const resultados = await getGeocode(v.endereco);
            if (resultados.length > 0) {
              const { lat, lon } = resultados[0];
              return { ...v, lat: parseFloat(lat), lon: parseFloat(lon) };
            }
          } catch (err) {
            console.error("Erro geocode:", err);
          }
          return v;
        })
      );
      setVisitas(visitasComCoords);
    }
    carregarVisitas();
  }, []);

  return (
    <div style={{ display: "flex", height: "70vh", width: "100%" }}>
      {/* Mapa */}
      <div style={{ flex: 3 }}>
        <MapContainer center={[-25.4284, -49.2733]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visitas.map((v, i) =>
            v.lat && v.lon ? (
              <Marker
                key={i}
                position={[v.lat, v.lon]}
                icon={getIcon(coresTecnicos[v.tecnico_id] || "red")}
              >
                <Popup>
                  <strong>{v.empresa}</strong><br />
                  Técnico: {v.tecnico}<br />
                  Analista: {v.analista}<br />
                  Endereço: {v.endereco}<br />
                  Data: {v.data_agendamento}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Legenda */}
      <div style={{
        flex: 1,
        background: "#f9f9f9",
        padding: "15px",
        borderLeft: "2px solid #ddd",
        overflowY: "auto"
      }}>
        <h3>Legenda de Técnicos</h3>
        {Object.entries(coresTecnicos).map(([id, cor]) => (
          <div key={id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <img
              src={`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`}
              alt={`Técnico ${id}`}
              style={{ width: "20px", marginRight: "8px" }}
            />
            <span>Técnico {id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mapa;
