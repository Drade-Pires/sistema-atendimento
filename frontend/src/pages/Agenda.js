import React from "react";

function ModalEdicao({ visita, tecnicos, analistas, onChange, onSalvar, onCancelar }) {
  if (!visita) return null;

  // garante que a data esteja no formato YYYY-MM-DD
  const dataFormatada = visita.data_agendamento
    ? visita.data_agendamento.split("T")[0]
    : "";

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Visita</h3>

        <input
          type="date"
          value={dataFormatada}
          onChange={e => onChange({ ...visita, data_agendamento: e.target.value })}
        />

        <select
          value={visita.tecnico_id || ""}
          onChange={e => onChange({ ...visita, tecnico_id: parseInt(e.target.value) })}
        >
          <option value="">Selecione o técnico</option>
          {tecnicos.map(t => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </select>

        <select
          value={visita.analista_id || ""}
          onChange={e => onChange({ ...visita, analista_id: parseInt(e.target.value) })}
        >
          <option value="">Selecione o analista</option>
          {analistas.map(a => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>

        <select
          value={visita.zona || ""}
          onChange={e => onChange({ ...visita, zona: e.target.value })}
        >
          <option value="">Selecione a zona</option>
          {[...Array(9)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>

        <select
          value={visita.regiao || ""}
          onChange={e => onChange({ ...visita, regiao: e.target.value })}
        >
          <option value="">Selecione a região</option>
          <option>São Paulo</option>
          <option>Rio de Janeiro</option>
          <option>Curitiba</option>
        </select>

        <input
          type="text"
          placeholder="Empresa"
          value={visita.empresa || ""}
          onChange={e => onChange({ ...visita, empresa: e.target.value })}
        />

        <input
          type="text"
          placeholder="Endereço"
          value={visita.endereco || ""}
          onChange={e => onChange({ ...visita, endereco: e.target.value })}
        />

        <div className="modal-actions">
          <button className="btn-salvar" onClick={onSalvar}>Salvar</button>
          <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalEdicao;
