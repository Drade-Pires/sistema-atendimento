export function formatarEndereco(chamado) {
  if (!chamado) return "—";

  const { endereco, numero, cidade, estado, cep } = chamado;

  const partes = [];

  if (endereco) partes.push(endereco);
  if (numero) partes.push(numero);
  if (cidade) partes.push(cidade);
  if (estado) partes.push(estado);
  if (cep) partes.push(`CEP: ${cep}`);

  // monta string no formato "Rua, Nº - Cidade/Estado (CEP: ...)"
  let texto = "";

  if (endereco) {
    texto += endereco;
    if (numero) texto += `, ${numero}`;
  }

  if (cidade || estado) {
    texto += ` - ${cidade || ""}${estado ? `/${estado}` : ""}`;
  }

  if (cep) {
    texto += ` (CEP: ${cep})`;
  }

  return texto.trim() || "—";
}
