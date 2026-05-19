export function formatarEndereco(chamado) {
  const { endereco, numero, cidade, estado } = chamado;
  return `${endereco}, ${numero} - ${cidade}/${estado}`;
}
