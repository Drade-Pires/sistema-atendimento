import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chamados from "./pages/Chamados";
import Agenda from "./pages/Agenda";
import Mapa from "./pages/Mapa";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          padding: "20px",
          backgroundColor: "#f0f0f0"
        }}
      >
        <Link
          to="/chamados"
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Chamados
        </Link>

        <Link
          to="/agenda"
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Agenda
        </Link>

        <Link
          to="/mapa"
          style={{
            padding: "12px 24px",
            backgroundColor: "#ff9800",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Mapa
        </Link>
      </nav>

      <Routes>
        <Route path="/chamados" element={<Chamados />} />
        <Route path="/agenda" element={<Agenda tecnicoId={1} />} />
        <Route path="/mapa" element={<Mapa />} />
      </Routes>
    </Router>
  );
}

export default App;
