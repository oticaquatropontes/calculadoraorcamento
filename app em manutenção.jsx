import { useState, useEffect } from "react";
import { buscarIndiceGeral } from "../../../services/configuracoes";
import "./NovoOrcamento.css";


function NovoOrcamento({ voltar }) {

const [indiceCalculo, setIndiceCalculo] = useState(
  Number(localStorage.getItem("indice_geral")) || 0
);

  const [cliente, setCliente] = useState("");
  const [modelo, setModelo] = useState("");

  const [indice416, setIndice416] = useState("");
  const [indice18DNatural, setIndice18DNatural] = useState("");
  const [indice18DSintetica, setIndice18DSintetica] = useState("");
  const [indice18ZNatural, setIndice18ZNatural] = useState("");
  const [indice18ZSintetica, setIndice18ZSintetica] = useState("");
  const [indicePedra, setIndicePedra] = useState("");



  useEffect(() => {

  async function carregarIndice() {

    const valor = await buscarIndiceGeral();

    console.log("BUSCOU ÍNDICE:", valor);

    if (valor !== null && valor !== undefined) {

      setIndiceCalculo(Number(valor));

      localStorage.setItem(
        "indice_geral",
        Number(valor)
      );

    }

  }

  carregarIndice();

}, []);





  function converterNumero(valor) {

    if (!valor) return null;

    const numero = Number(
      String(valor).replace(",", ".")
    );

    if (isNaN(numero)) {
      return null;
    }

    return numero;

  }





  function calcularSimples(indice) {

    const valor = converterNumero(indice);

    if (!valor || !indiceCalculo) {
      return null;
    }

    return (
      valor * indiceCalculo
    ).toFixed(2);

  }





  function calcularNatural(indice) {

    const valor = converterNumero(indice);
    const pedra = converterNumero(indicePedra);


    if (!valor || !indiceCalculo) {
      return null;
    }


    if (!pedra) {
      return "Aguardando índice da pedra";
    }


    return (
      (valor + pedra) * indiceCalculo
    ).toFixed(2);

  }





  function limparCampos() {

    setCliente("");
    setModelo("");

    setIndice416("");
    setIndice18DNatural("");
    setIndice18DSintetica("");
    setIndice18ZNatural("");
    setIndice18ZSintetica("");
    setIndicePedra("");

  }





  return (

    <div className="container">


      <h1>💍 Novo Orçamento</h1>



      <p>
        <span>Índice de cálculo:</span>
        <span>
          {" "}R$ {indiceCalculo}
        </span>
      </p>




      <label>Cliente</label>

      <input
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        placeholder="Digite o nome do cliente"
      />




      <label>Nome do Modelo</label>

      <input
        value={modelo}
        onChange={(e) => setModelo(e.target.value)}
        placeholder="Ex.: Medicina"
      />




      <h3>Coeficientes</h3>




      <label>416KT</label>

      <input
        value={indice416}
        onChange={(e) => setIndice416(e.target.value)}
      />




      <label>18KT D Pedra Natural</label>

      <input
        value={indice18DNatural}
        onChange={(e) => setIndice18DNatural(e.target.value)}
      />




      <label>18KT D Pedra Sintética</label>

      <input
        value={indice18DSintetica}
        onChange={(e) => setIndice18DSintetica(e.target.value)}
      />




      <label>18KT Z Pedra Natural</label>

      <input
        value={indice18ZNatural}
        onChange={(e) => setIndice18ZNatural(e.target.value)}
      />




      <label>18KT Z Pedra Sintética</label>

      <input
        value={indice18ZSintetica}
        onChange={(e) => setIndice18ZSintetica(e.target.value)}
      />




      <label>Índice da Pedra</label>

      <input
        value={indicePedra}
        onChange={(e) => setIndicePedra(e.target.value)}
      />





      <hr />




      <h3>Resultado do Orçamento</h3>




      <p>
        <span>416KT:</span>
        <span>
          {indice416
            ? ` R$ ${calcularSimples(indice416)}`
            : null}
        </span>
      </p>




      <p>
        <span>18KT D Pedra Natural:</span>
        <span>
          {indice18DNatural
            ? ` ${calcularNatural(indice18DNatural)}`
            : null}
        </span>
      </p>




      <p>
        <span>18KT D Pedra Sintética:</span>
        <span>
          {indice18DSintetica
            ? ` R$ ${calcularSimples(indice18DSintetica)}`
            : null}
        </span>
      </p>




      <p>
        <span>18KT Z Pedra Natural:</span>
        <span>
          {indice18ZNatural
            ? ` ${calcularNatural(indice18ZNatural)}`
            : null}
        </span>
      </p>




      <p>
        <span>18KT Z Pedra Sintética:</span>
        <span>
          {indice18ZSintetica
            ? ` R$ ${calcularSimples(indice18ZSintetica)}`
            : null}
        </span>
      </p>





      <button onClick={limparCampos}>
        🧹 Limpar
      </button>




      <button>
        💾 Salvar Orçamento
      </button>




      <button>
        📱 Enviar WhatsApp
      </button>




      <button
        className="voltar"
        onClick={voltar}
      >
        ⬅ Voltar
      </button>




    </div>

  );

}


export default NovoOrcamento;