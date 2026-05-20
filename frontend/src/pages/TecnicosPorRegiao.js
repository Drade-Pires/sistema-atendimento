import { useState, useEffect } from "react";

function TecnicosPorRegiao() {
  const [regiao, setRegiao] = useState("São Paulo");
  const [tecnicos, setTecnicos] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/tecnicos/regiao/${regiao}`)
      .then(res => res.json())
      .then(data => setTecnicos(data));
  }, [regiao]);

  return (
    <div>
      <select value={regiao} onChange={e => setRegiao(e.target.value)}>
        <option>São Paulo</option>
        <option>Rio de Janeiro</option>
        <option>Curitiba</option>
      </select>

      <ul>
        {tecnicos.map(t => (
          <li key={t.id}>{t.nome} - {t.especialidade}</li>
        ))}
      </ul>
    </div>
  );
}

export default TecnicosPorRegiao;
