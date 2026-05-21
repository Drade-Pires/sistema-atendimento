import React from "react";

function VisitaForm({ visita, setVisita, tecnicos, analistas, onSave, onCancel }) {
  return (
    <div className="modal">
      <div>
        <h3>{visita.id ? "Editar Visita" : "Agendar Nova Visita"}</h3>
        <input
          type="date"
          value={visita.data_agendamento}
          onChange={e => setVisita({ ...visita, data_agendamento: e.target.value })}
        />
        <select
          value={visita.tecnico_id}
          onChange={e => setVisita({ ...visita, tecnico_id: parseInt(e.target.value) })}
        >
          {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
        <select
          value={visita.analista_id}
          onChange={e => setVisita({ ...visita, analista_id: parseInt(e.target.value) })}
        >
          <option value="">Selecione o analista</option>
          {analistas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
        <input type="text" placeholder="Empresa" value={visita.empresa || ""} onChange={e => setVisita({ ...visita, empresa: e.target.value })} />
        <input type="text" placeholder="CEP" value={visita.cep || ""} onChange={e => setVisita({ ...visita, cep: e.target.value })} />
        <input type="text" placeholder="Número" value={visita.numero || ""} onChange={e => setVisita({ ...visita, numero: e.target.value })} />
        <input type="text" placeholder="Endereço" value={visita.endereco || ""} onChange={e => setVisita({ ...visita, endereco: e.target.value })} />
        <input type="text" placeholder="Cidade" value={visita.cidade || ""} onChange={e => setVisita({ ...visita, cidade: e.target.value })} />
        <input type="text" placeholder="Estado" value={visita.estado || ""} onChange={e => setVisita({ ...visita, estado: e.target.value })} />
        <div className="modal-actions">
          <button onClick={onSave}>Salvar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default VisitaForm;
