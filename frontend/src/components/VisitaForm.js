import React from "react";

function InputField({ label, type="text", value, onChange, placeholder }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <select value={value || ""} onChange={e => onChange(e.target.value)}>
        <option value="">Selecione</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function VisitaForm({ visita, setVisita, tecnicos, analistas, onSave, onCancel }) {
  return (
    <div className="modal">
      <div>
        <h3>{visita.id ? "Editar Visita" : "Agendar Nova Visita"}</h3>

        <InputField type="date" value={visita.data_agendamento}
          onChange={val => setVisita({ ...visita, data_agendamento: val })} />

        <SelectField value={visita.tecnico_id}
          onChange={val => setVisita({ ...visita, tecnico_id: parseInt(val) })}
          options={tecnicos.map(t => ({ value: t.id, label: t.nome }))} />

        <SelectField value={visita.analista_id}
          onChange={val => setVisita({ ...visita, analista_id: parseInt(val) })}
          options={analistas.map(a => ({ value: a.id, label: a.nome }))} />

        <InputField placeholder="Empresa" value={visita.empresa}
          onChange={val => setVisita({ ...visita, empresa: val })} />
        <InputField placeholder="CEP" value={visita.cep}
          onChange={val => setVisita({ ...visita, cep: val })} />
        <InputField placeholder="Número" value={visita.numero}
          onChange={val => setVisita({ ...visita, numero: val })} />
        <InputField placeholder="Endereço" value={visita.endereco}
          onChange={val => setVisita({ ...visita, endereco: val })} />
        <InputField placeholder="Cidade" value={visita.cidade}
          onChange={val => setVisita({ ...visita, cidade: val })} />
        <InputField placeholder="Estado" value={visita.estado}
          onChange={val => setVisita({ ...visita, estado: val })} />

        <div className="modal-actions">
          <button onClick={onSave}>Salvar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default VisitaForm;
