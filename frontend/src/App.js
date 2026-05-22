import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Chamados from "./pages/Chamados";
import Agenda from "./pages/Agenda";
import Mapa from "./pages/Mapa";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="logo">Minha Agenda</h2>
          <nav className="menu">
            <NavLink to="/chamados" className="menu-item">
              Chamados
            </NavLink>
            <NavLink to="/agenda" className="menu-item">
              Agenda
            </NavLink>
            <NavLink to="/mapa" className="menu-item">
              Mapa
            </NavLink>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="content">
          <Routes>
            {/* redireciona / para /mapa */}
            <Route path="/" element={<Navigate to="/mapa" />} />
            <Route path="/chamados" element={<Chamados />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/mapa" element={<Mapa />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
