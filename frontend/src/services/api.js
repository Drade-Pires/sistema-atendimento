const API_URL = process.env.REACT_APP_API_URL;

async function handleResponse(response, action) {
  if (!response.ok) {
    const erro = await response.text();
    throw new Error(`Erro ao ${action}: ${erro}`);
  }
  return response.json();
}

export async function getChamados() {
  const response = await fetch(`${API_URL}/chamados`);
  return handleResponse(response, "buscar chamados");
}

export async function criarChamado(chamado) {
  const response = await fetch(`${API_URL}/chamados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado),
  });
  return handleResponse(response, "criar chamado");
}

export async function getClientes() {
  const response = await fetch(`${API_URL}/clientes`);
  return handleResponse(response, "buscar clientes");
}

export async function criarCliente(cliente) {
  const response = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return handleResponse(response, "criar cliente");
}

export async function getTecnicos() {
  const response = await fetch(`${API_URL}/tecnicos`);
  return handleResponse(response, "buscar técnicos");
}

// NOVO: pega técnicos filtrados por região
export async function getTecnicosPorRegiao(regiao) {
  const response = await fetch(`${API_URL}/tecnicos/regiao/${regiao}`);
  return handleResponse(response, "buscar técnicos por região");
}

export async function criarTecnico(tecnico) {
  const response = await fetch(`${API_URL}/tecnicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });
  return handleResponse(response, "criar técnico");
}

export async function getAgenda(tecnicoId) {
  const response = await fetch(`${API_URL}/agenda/${tecnicoId}`);
  return handleResponse(response, "buscar agenda");
}

export async function atualizarStatusChamado(id, status) {
  const response = await fetch(`${API_URL}/chamados/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return handleResponse(response, "atualizar status do chamado");
}

export async function getHistorico(clienteId) {
  const response = await fetch(`${API_URL}/historico/${clienteId}`);
  return handleResponse(response, "buscar histórico");
}

export async function getAnalistas() {
  const response = await fetch(`${API_URL}/analistas`);
  return handleResponse(response, "buscar analistas");
}

export async function criarVisita(visita) {
  const response = await fetch(`${API_URL}/visitas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita),
  });
  return handleResponse(response, "criar visita");
}

export async function getVisitas() {
  const response = await fetch(`${API_URL}/visitas`);
  return handleResponse(response, "buscar visitas");
}

export async function atualizarVisita(id, visita) {
  const response = await fetch(`${API_URL}/visitas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visita)
  });
  return handleResponse(response, "atualizar visita");
}

export async function excluirVisita(id) {
  const response = await fetch(`${API_URL}/visitas/${id}`, {
    method: "DELETE"
  });
  return handleResponse(response, "excluir visita");
}

export async function getGeocode(endereco) {
  const response = await fetch(`${API_URL}/geocode?q=${encodeURIComponent(endereco)}`);
  return handleResponse(response, "buscar geocode");
}

export async function getGeocodeEndereco(enderecoCompleto) {
  const response = await fetch(`${API_URL}/geocode?q=${encodeURIComponent(enderecoCompleto)}`);
  return handleResponse(response, "buscar geocode do endereço completo");
}
