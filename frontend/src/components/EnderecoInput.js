import React, { useState } from "react";

function EnderecoInput({ value, onChange }) {
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  async function buscarCep() {
    if (cep.length === 8) {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resp.json();

      if (!dados.erro) {
        setLogradouro(dados.logradouro);
        setCidade(dados.localidade);
        setEstado(dados.uf);

        atualizarEndereco(dados.logradouro, numero, dados.localidade, dados.uf);
      }
    }
  }

  function atualizarEndereco(logradouro, numero, cidade, estado) {
    const enderecoFormatado = `${logradouro}, ${numero} - ${cidade}/${estado}`;
    onChange({
      cep,
      endereco: logradouro,
      numero,
      cidade,
      estado,
      display_name: enderecoFormatado,
      lat: null,
      lon: null
    });
  }

  return (
    <div>
      <label>CEP:
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          onBlur={buscarCep}
          placeholder="Digite o CEP"
        />
      </label>

      <label>Endereço:
        <input
          type="text"
          value={logradouro}
          onChange={(e) => {
            setLogradouro(e.target.value);
            atualizarEndereco(e.target.value, numero, cidade, estado);
          }}
          placeholder="Rua/Avenida"
        />
      </label>

      <label>Número:
        <input
          type="text"
          value={numero}
          onChange={(e) => {
            setNumero(e.target.value);
            atualizarEndereco(logradouro, e.target.value, cidade, estado);
          }}
          placeholder="Número"
        />
      </label>

      <label>Cidade:
        <input
          type="text"
          value={cidade}
          onChange={(e) => {
            setCidade(e.target.value);
            atualizarEndereco(logradouro, numero, e.target.value, estado);
          }}
        />
      </label>

      <label>Estado:
        <input
          type="text"
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value);
            atualizarEndereco(logradouro, numero, cidade, e.target.value);
          }}
        />
      </label>
    </div>
  );
}

export default EnderecoInput;
