import { useState, useEffect } from "react";
import { buscarIndiceGeral } from "../../../services/configuracoes";
import {
  salvarOrcamento,
  uploadImagemOrcamento
} from "../../../services/orcamentos";
import {
  buscarOuCriarCliente,
  buscarClientesPorNome
} from "../../../services/clientes";
import "./NovoOrcamento.css";
import { buscarModeloPorNome } from "../../../services/modelos";
import { supabase } from "../../../supabase";
import GerarImagemOrcamento from "./GerarImagemOrcamento";



function NovoOrcamento({ voltar }) {


const [indiceCalculo, setIndiceCalculo] = useState(0);

  const [cliente, setCliente] = useState("");
  const [clienteDigitado, setClienteDigitado] = useState("");
  const [textoBusca, setTextoBusca] = useState("");
const [clientesEncontrados, setClientesEncontrados] = useState([]);
const [clienteNovo, setClienteNovo] = useState(false);
const [mostrarListaClientes, setMostrarListaClientes] = useState(false);
  const [modelo, setModelo] = useState("");
  const [fotoModelo, setFotoModelo] = useState(null);

  const [indice416, setIndice416] = useState("");
  const [indice18DNatural, setIndice18DNatural] = useState("");
  const [indice18DSintetica, setIndice18DSintetica] = useState("");
  const [indice18ZNatural, setIndice18ZNatural] = useState("");
  const [indice18ZSintetica, setIndice18ZSintetica] = useState("");
  const [indicePedra, setIndicePedra] = useState("");
  const [mostrar416, setMostrar416] = useState(false);
  const [mostrar18, setMostrar18] = useState(false);
  const [orcamentoSalvo, setOrcamentoSalvo] = useState(false);
const [textoOrcamento, setTextoOrcamento] = useState("");
const [imagemOrcamento, setImagemOrcamento] = useState(null);
const [linkImagem, setLinkImagem] = useState(null);
const [imagemUrlSalva, setImagemUrlSalva] = useState(null);
const [linkOrcamento, setLinkOrcamento] = useState("");

function formatarValor(valor) {

  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

}

useEffect(() => {

  async function carregarIndice() {

    const valor = await buscarIndiceGeral();

    console.log("BUSCOU ÍNDICE:", valor);

    if (valor !== null && valor !== undefined) {

      setIndiceCalculo(Number(valor));

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

async function pesquisarClientes(valor) {

  setClienteDigitado(valor);
  setTextoBusca(valor);


  if (valor.trim().length < 3) {

    setClientesEncontrados([]);
    setMostrarListaClientes(false);

    return;

  }


  const resultado = await buscarClientesPorNome(valor);

  setClientesEncontrados(resultado);
  setMostrarListaClientes(true);

}

    async function salvar() {

  console.log("CLICOU EM SALVAR");

  // pega exatamente o que foi digitado
  const nomeFinal = clienteDigitado.trim();

  console.log("NOME FINAL:", nomeFinal);

  if (!nomeFinal) {

    alert("Digite o nome do cliente");
    return;

  }

  const texto = `
Cliente: ${nomeFinal}

Modelo: ${modelo}

ORÇAMENTO:

${mostrar416 && indice416
? `416KT:
R$ ${formatarValor(calcularSimples(indice416))}

`
: ""}

${mostrar18
? indice18DNatural
  ? `18KT D Pedra Natural:
${calcularNatural(indice18DNatural) === "Aguardando índice da pedra"
    ? "Aguardando índice da pedra"
    : `R$ ${formatarValor(calcularNatural(indice18DNatural))}`}

18KT D Pedra Sintética:
R$ ${formatarValor(calcularSimples(indice18DNatural))}

`
  : `Linha D (Diamante):
Modelo indisponível para pedras de diamante.

`
: ""}

${mostrar18 && indice18ZNatural
? `18KT Z Pedra Natural:
R$ ${formatarValor(calcularNatural(indice18ZNatural))}

`
: ""}

${mostrar18 && indice18ZNatural
? `18KT Z Pedra Sintética:
R$ ${formatarValor(calcularSimples(indice18ZNatural))}

`
: ""}
`;



// procura ou cria o cliente automaticamente
const idCliente = await buscarOuCriarCliente(nomeFinal);
console.log("ID CLIENTE:", idCliente);

if (!idCliente) {

  alert("Não foi possível salvar o cliente");
  return;

}

let imagemLinkFinal = null;


if (imagemOrcamento) {

  console.log("Salvando imagem antes do orçamento...");

  imagemLinkFinal = await uploadImagemOrcamento(
    imagemOrcamento
  );

  console.log(
    "LINK SALVO:",
    imagemLinkFinal
  );

  setLinkImagem(imagemLinkFinal);

}



const codigoPublico = Math.random()
  .toString(36)
  .substring(2, 8)
  .toUpperCase();

const resultado = await salvarOrcamento({
 cliente_id: idCliente,
 modelo: modelo,
 indiceCalculo: indiceCalculo,
 texto: texto,
 imagem_url: imagemLinkFinal,
 codigo_publico: codigoPublico
});

const link =
`https://calculadoraorcamento-mu.vercel.app/orcamento/${resultado.codigo_publico}`;

console.log("LINK DO ORÇAMENTO:", link);

setLinkOrcamento(link);


   if (resultado) {

      setTextoOrcamento(texto);
      setOrcamentoSalvo(true);

      alert("Orçamento salvo com sucesso!");

    } else {

      alert("Erro ao salvar orçamento");

    }

  }

const mostrarResultado =
  indice416 ||
  indice18DNatural ||
  indice18DSintetica ||
  indice18ZNatural ||
  indice18ZSintetica;

 async function enviarWhatsApp() {

  console.log(
    "LINK DO ORÇAMENTO:",
    linkOrcamento
  );


  const mensagem =
`Olá, ${clienteDigitado}!

Conforme conversamos, segue o orçamento do seu anel de formatura:

Cliente: ${clienteDigitado}

${textoOrcamento.replace(
`Cliente: ${clienteDigitado}\n\nModelo: ${modelo}\n`,
`Modelo: ${modelo}\n`
)}

💍 Seu orçamento completo está disponível no link abaixo:

${linkOrcamento}

Ficamos à disposição para qualquer dúvida.
Será um prazer fazer parte desse momento especial.`;


  window.open(
    `https://wa.me/?text=${encodeURIComponent(mensagem)}`,
    "_blank"
  );

}

async function copiarOrcamento() {

 const mensagem = 
`Olá, ${clienteDigitado}!

Conforme conversamos, segue o orçamento do seu anel de formatura:

Cliente: ${clienteDigitado}

${textoOrcamento.replace(`Cliente: ${clienteDigitado}\n\nModelo: ${modelo}\n`, `Modelo: ${modelo}\n`)}

Ficamos à disposição para qualquer dúvida.
Será um prazer fazer parte desse momento especial.`;


  await navigator.clipboard.writeText(mensagem);


  alert("Orçamento copiado!");

}

async function verificarModelo(valor) {

  setModelo(valor);

  // limpa imagem anterior quando trocar o modelo
  setImagemOrcamento(null);


  if (!valor.trim()) {

    setFotoModelo(null);
    return;

  }


  const encontrado = await buscarModeloPorNome(valor);


  if (encontrado && encontrado.foto_url) {

    setFotoModelo(encontrado.foto_url);

  } else {

    setFotoModelo(null);

  }

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

<div className="campo-cliente">

  <input
  value={clienteDigitado}
  onChange={(e) => pesquisarClientes(e.target.value)}
  placeholder="Digite o nome do cliente"
/>


 {mostrarListaClientes && clienteDigitado.trim().length >= 2 && (

  <div className="lista-clientes">


    {clientesEncontrados.map((item) => (

  <div
    key={item.id}
    onClick={() => {

      setClienteDigitado(item.nome_cliente);
      setClientesEncontrados([]);

    }}
    className="cliente-item"
  >

    {item.nome_cliente}

  </div>

))}

<div
  className="cliente-item usar-nome"
  onClick={() => {

    setClienteDigitado(clienteDigitado);
    setMostrarListaClientes(false);
    setClientesEncontrados([]);

  }}
>
  ➕ USAR: {clienteDigitado}
</div>






  </div>

)}

</div>


      <label>Nome do Modelo</label>

<input
  value={modelo}
  onChange={(e) => verificarModelo(e.target.value)}
  placeholder="Ex.: Medicina"
/>


{fotoModelo && (

  <div className="card-foto-modelo">

    <span>
      📸 Modelo encontrado
    </span>


    <img
      src={fotoModelo}
      alt="Modelo do anel"
    />

  </div>

)}

{fotoModelo && (

  <GerarImagemOrcamento
    fotoModelo={fotoModelo}
    modelo={modelo}
    cliente={clienteDigitado}
    texto={textoOrcamento}
    onGerada={setImagemOrcamento}
  />

)}

      <h3>Tipo de Ouro</h3>

<div className="cards-ouro">

  <div
    className={`card-ouro ${mostrar416 ? "ativo" : ""}`}
    onClick={() => setMostrar416(!mostrar416)}
  >
    <div className="icone-card">
  {mostrar416 ? "✓" : "○"}
</div>

    <div>
      <strong>Ouro 416 KT</strong>
      <p>Orçamentos em ouro 416KT.</p>
    </div>
  </div>

  <div
    className={`card-ouro ${mostrar18 ? "ativo" : ""}`}
    onClick={() => setMostrar18(!mostrar18)}
  >
    <div className="icone-card">
  {mostrar18 ? "✓" : "○"}
</div>

    <div>
      <strong>Ouro 18 KT</strong>
      <p>Orçamentos em ouro 18KT.</p>
    </div>
  </div>

</div>

<hr />


      <h3>Índices Anel</h3>




     {mostrar416 && (
  <>
    <label>416KT</label>

    <input
      value={indice416}
      onChange={(e) => setIndice416(e.target.value)}
    />
  </>
)}


      {mostrar18 && (
  <>
  

      <label>18KT D Pedra Natural</label>

      <input
        value={indice18DNatural}
        onChange={(e) => setIndice18DNatural(e.target.value)}
      />




      <label>18KT D Pedra Sintética</label>

<input
  value={indice18DNatural}
  disabled
  className="campo-bloqueado"
/>




      <label>18KT Z Pedra Natural</label>

      <input
        value={indice18ZNatural}
        onChange={(e) => setIndice18ZNatural(e.target.value)}
      />




      <label>18KT Z Pedra Sintética</label>

<input
  value={indice18ZNatural}
  disabled
  className="campo-bloqueado"
/>




      <label>Índice da Pedra</label>

      <input
        value={indicePedra}
        onChange={(e) => setIndicePedra(e.target.value)}
      />

          </>
)}

{mostrarResultado && (
  <>
    <hr />

    <div className="preview-orcamento">

      <div className="preview-header">
        <h3>Prévia do Orçamento</h3>
      </div>

      <div className="preview-tabela">

        <div className="linha-orcamento">
          <span>Modelo</span>
          <strong>{modelo || "Não informado"}</strong>
        </div>

        {mostrar416 && indice416 && (
          <div className="linha-orcamento">
            <span>416KT</span>
            <strong>
              R$ {formatarValor(calcularSimples(indice416))}
            </strong>
          </div>
        )}

        {mostrar18 && (
  <>
    {indice18DNatural ? (
      <>
        <div className="linha-orcamento">
          <span>18KT D Pedra Natural</span>
          <strong>
            {calcularNatural(indice18DNatural) === "Aguardando índice da pedra"
              ? "Aguardando índice da pedra"
              : `R$ ${formatarValor(calcularNatural(indice18DNatural))}`}
          </strong>
        </div>

        <div className="linha-orcamento">
          <span>18KT D Pedra Sintética</span>
          <strong>
            R$ {formatarValor(calcularSimples(indice18DNatural))}
          </strong>
        </div>
      </>
    ) : (
      <div className="linha-orcamento linha-aviso">
        <span>Linha D (Diamante)</span>
        <strong>Modelo indisponível para pedras de diamante.</strong>
      </div>
    )}
  </>
)}

        {mostrar18 && indice18ZNatural && (
          <div className="linha-orcamento">
            <span>18KT Z Pedra Natural</span>
            <strong>
              {calcularNatural(indice18ZNatural) === "Aguardando índice da pedra"
                ? "Aguardando índice da pedra"
                : `R$ ${formatarValor(calcularNatural(indice18ZNatural))}`}
            </strong>
          </div>
        )}

        {mostrar18 && indice18ZNatural && (
          <div className="linha-orcamento">
            <span>18KT Z Pedra Sintética</span>
            <strong>
              R$ {formatarValor(calcularSimples(indice18ZNatural))}
            </strong>
          </div>
        )}

      </div>
    </div>
  </>
)}



      <button onClick={limparCampos}>
        🧹 Limpar
      </button>




      <button onClick={salvar}>
  💾 Salvar Orçamento
</button>




      {orcamentoSalvo && (

<>

<button onClick={enviarWhatsApp}>
  📱 Enviar WhatsApp
</button>


<button onClick={copiarOrcamento}>
  📋 Copiar Orçamento
</button>

</>

)}




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