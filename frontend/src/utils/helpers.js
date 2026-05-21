export function validarVisita(v) {
  return v.empresa && v.endereco && v.numero && v.cidade && v.estado && v.regiao;
}

export function formatarEndereco(v) {
  return `${v.endereco}, ${v.numero} - ${v.cidade}/${v.estado}, ${v.cep}`;
}

export async function buscarCoordenadas(getGeocodeEndereco, enderecoCompleto, cidade) {
  const resultados = await getGeocodeEndereco(enderecoCompleto);
  const resultadoValido = resultados.find(r =>
    r.display_name && r.display_name.toLowerCase().includes(cidade.toLowerCase())
  );
  return resultadoValido
    ? { lat: parseFloat(resultadoValido.lat), lon: parseFloat(resultadoValido.lon) }
    : { lat: null, lon: null };
}
