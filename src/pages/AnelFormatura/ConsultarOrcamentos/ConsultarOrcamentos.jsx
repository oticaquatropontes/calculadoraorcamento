import { useEffect, useState } from "react";
import { buscarOrcamentos } from "../../../services/orcamentos";
import "./ConsultarOrcamentos.css";


function ConsultarOrcamentos({ voltar }) {


  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [imagemExpandida, setImagemExpandida] = useState(false);

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaModelo, setBuscaModelo] = useState("");
  const [buscaData, setBuscaData] = useState("");



  useEffect(() => {

    carregar();

  }, []);




  async function carregar() {

  console.log("1 - Entrou em carregar");

  const dados = await buscarOrcamentos();

  console.log("2 - Dados recebidos:", dados);

  setOrcamentos(dados);

  console.log("3 - Estado atualizado");

}






  const orcamentosFiltrados = orcamentos.filter((orcamento) => {


    const nome =
      orcamento.clientes?.nome_cliente?.toLowerCase() || "";


    const modelo =
      orcamento.modelo_anel?.toLowerCase() || "";


    const data =
      orcamento.data_orcamento
      ? new Date(
          orcamento.data_orcamento
        ).toLocaleDateString("pt-BR")
      : "";



    return (

      nome.includes(
        buscaNome.toLowerCase()
      )

      &&

      modelo.includes(
        buscaModelo.toLowerCase()
      )

      &&

      data.includes(
        buscaData
      )

    );


  });







  function formatarValorMensagem(valor) {


    if (!valor) {

      return "0,00";

    }



    let numero = valor
      .toString()
      .replace("R$", "")
      .replace(/\s/g,"");



    numero = numero
      .replace(".", "")
      .replace(",", ".");



    numero = Number(numero);



    if(isNaN(numero)){

      return "0,00";

    }



    return numero.toLocaleString("pt-BR", {

      minimumFractionDigits: 2,

      maximumFractionDigits: 2

    });


  }








  function montarMensagem(orcamento) {


  const nomeCliente =
    orcamento.clientes?.nome_cliente || "cliente";



  let partes =
    orcamento.texto_orcamento
    .split("ORÇAMENTO:")[1]
    ?.trim() || "";




  partes = partes

  .replace(
    /416KT:\s*\nR\$ ([^\n]+)/g,
    (match, valor) =>
    `Ouro 416KT:
R$ ${formatarValorMensagem(valor)}`
  )


  .replace(
    /18KT D Pedra Natural:\s*\nR\$ ([^\n]+)/g,
    (match, valor) =>
    `Ouro 18KT D Pedra Natural:
R$ ${formatarValorMensagem(valor)}`
  )


  .replace(
    /18KT D Pedra Sintética:\s*\nR\$ ([^\n]+)/g,
    (match, valor) =>
    `Ouro 18KT D Pedra Sintética:
R$ ${formatarValorMensagem(valor)}`
  )


  .replace(
    /18KT Z Pedra Natural:\s*\nR\$ ([^\n]+)/g,
    (match, valor) =>
    `Ouro 18KT Z Pedra Natural:
R$ ${formatarValorMensagem(valor)}`
  )


  .replace(
    /18KT Z Pedra Sintética:\s*\nR\$ ([^\n]+)/g,
    (match, valor) =>
    `Ouro 18KT Z Pedra Sintética:
R$ ${formatarValorMensagem(valor)}`
  );




  return (

`Olá, ${nomeCliente}!

Conforme conversamos, segue o orçamento do seu anel de formatura:

Modelo: ${orcamento.modelo_anel}

${partes}

${orcamento.imagem_url 
? 
`
📸 Imagem do modelo:
${orcamento.imagem_url}
`
: 
""}

${orcamento.imagem_url 
? 
`📸 Imagem do modelo:
${orcamento.imagem_url}`
:
""}

Ficamos à disposição para qualquer dúvida.
Será um prazer fazer parte desse momento especial.`

  );


}






  function enviarWhatsApp(orcamento) {


    const mensagem =
      montarMensagem(orcamento);



    window.open(

      `https://wa.me/?text=${encodeURIComponent(mensagem)}`,

      "_blank"

    );


  }





  async function copiarOrcamento(orcamento) {


    const mensagem =
      montarMensagem(orcamento);



    await navigator.clipboard.writeText(mensagem);



    alert("Orçamento copiado!");

  }
    return (

    <div className="container">


      <button
        className="voltar"
        onClick={voltar}
      >
        Voltar
      </button>



      <h1>
        Orçamentos
      </h1>





      <div className="filtros-orcamento">


        <input

          placeholder="Buscar por cliente"

          value={buscaNome}

          onChange={(e)=>
            setBuscaNome(e.target.value)
          }

        />




        <input

          placeholder="Buscar por modelo"

          value={buscaModelo}

          onChange={(e)=>
            setBuscaModelo(e.target.value)
          }

        />





        <input

          placeholder="Buscar por data (DD/MM/AAAA)"

          value={buscaData}

          onChange={(e)=>{


            let valor = e.target.value;


            valor = valor.replace(/\D/g,"");



            if(valor.length > 2){

              valor =
              valor.substring(0,2)
              +
              "/"
              +
              valor.substring(2);

            }



            if(valor.length > 5){

              valor =
              valor.substring(0,5)
              +
              "/"
              +
              valor.substring(5,9);

            }



            setBuscaData(valor);


          }}

        />


      </div>







      {orcamentosFiltrados.map((orcamento)=>(


        <div

          className="card-orcamento"

          key={orcamento.id}

        >



          <h3>

            {
              orcamento.clientes?.nome_cliente
              ||
              "Cliente não encontrado"
            }

          </h3>




          <p>
            Modelo: {orcamento.modelo_anel}
          </p>




          <p>

            Data:

            {
              orcamento.data_orcamento

              ?

              new Date(
                orcamento.data_orcamento
              ).toLocaleDateString("pt-BR")

              :

              "-"
            }

          </p>




          <p>

            Índice usado:

            {" R$ "}

            {
              Number(
                orcamento.indice_calculo
              ).toLocaleString("pt-BR",{

                minimumFractionDigits:2

              })

            }

          </p>






          <button

            onClick={()=>
              setOrcamentoSelecionado(orcamento)
            }

          >

            Ver orçamento

          </button>





          <button

            onClick={()=>
              enviarWhatsApp(orcamento)
            }

          >

            WhatsApp

          </button>





          <button

            onClick={()=>
              copiarOrcamento(orcamento)
            }

          >

            Copiar orçamento

          </button>



        </div>


      ))}







      {
        orcamentoSelecionado && (


          <div className="modal-orcamento">


            <h2>
              Orçamento
            </h2>




            <p>

              Cliente:

              {" "}

              {
                orcamentoSelecionado
                .clientes
                ?.nome_cliente
              }

            </p>




            <p>

              Índice usado:

              {" R$ "}

              {
                Number(
                  orcamentoSelecionado.indice_calculo
                ).toLocaleString("pt-BR",{

                  minimumFractionDigits:2

                })

              }

            </p>





            <div className="texto-orcamento">

              {
                orcamentoSelecionado.texto_orcamento
              }

            </div>

            {
  orcamentoSelecionado.imagem_url && (

    <div className="imagem-orcamento">

      <h3>
        📸 Modelo do anel
      </h3>

      <img
        src={orcamentoSelecionado.imagem_url}
        alt="Modelo do anel"

        style={{
          width: imagemExpandida ? "90%" : "180px",
          maxWidth: "500px",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "0.3s"
        }}

        onClick={() => {
          console.log("CLICOU NA IMAGEM");
          setImagemExpandida(!imagemExpandida);
        }}

      />

      <small>
        Clique na imagem para ampliar
      </small>

    </div>

  )
}





            <button

              onClick={() => {

  setOrcamentoSelecionado(null);
  setImagemExpandida(false);

}}

            >

              Fechar

            </button>



          </div>


        )

      }






    </div>

  );


}


export default ConsultarOrcamentos;