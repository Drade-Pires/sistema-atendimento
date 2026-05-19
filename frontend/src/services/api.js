const API_URL = "http://localhost:3000";

export async function getChamados() {
  const response = await fetch(`${API_URL}/chamados`);
  return response.json();
}

export async function criarChamado(chamado) {
  const response = await fetch(`${API_URL}/chamados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado),
  });
  return response.json();
}

export async function getClientes() {
  const response = await fetch(`${API_URL}/clientes`);
  return response.json();
}

export async function criarCliente(cliente) {
  const response = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return response.json();
}

export async function getTecnicos() {
  const response = await fetch(`${API_URL}/tecnicos`);
  return response.json();
}

export async function criarTecnico(tecnico) {
  const response = await fetch(`${API_URL}/tecnicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });
  return response.json();
}

export async function getAgenda(tecnicoId) {
  const response = await fetch(`${API_URL}/agenda/${tecnicoId}`);
  return response.json();
}

export async function atualizarStatusChamado(id, status) {
  const response = await fetch(`${API_URL}/chamados/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return response.json();
}

export async function getHistorico(clienteId) {
  const response = await fetch(`${API_URL}/historico/${clienteId}`);
  return response.json();
}

export async function getAnalistas() {
  const response = await fetch(`${API_URL}/analistas`);
  return response.json();
}

export async function criarVisita(visita) {
  const response = await fetch(`${API_URL}/visitas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita),
  });
  return response.json();
}

export async function getVisitas() {
  const response = await fetch(`${API_URL}/visitas`);
  return response.json();
}

export async function atualizarVisita(id, visita) {
  const response = await fetch(`${API_URL}/visitas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita)
  });
  return response.json();
}

export async function excluirVisita(id) {
  const response = await fetch(`${API_URL}/visitas/${id}`, {
    method: "DELETE"
  });
  return response.json();
}

export async function getGeocode(endereco) {
  const response = await fetch(`${API_URL}/geocode?q=${encodeURIComponent(endereco)}`);
  return response.json();
}

