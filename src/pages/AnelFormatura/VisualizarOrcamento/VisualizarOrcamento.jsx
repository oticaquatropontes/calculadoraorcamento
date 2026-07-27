import { useEffect, useState } from "react";
import { buscarOrcamentoPorCodigo } from "../../../services/orcamentos";
import "./VisualizarOrcamento.css";


function VisualizarOrcamento() {


  const [orcamento, setOrcamento] = useState(null);
  const [mostrarWhatsApp, setMostrarWhatsApp] = useState(false);



  useEffect(() => {

    carregarOrcamento();

  }, []);




  async function carregarOrcamento() {


    const caminho = window.location.pathname;

    const codigo =
      caminho.split("/")[2];


    console.log("CÓDIGO RECEBIDO:", codigo);



    if (!codigo) {

      return;

    }



    const dados =
      await buscarOrcamentoPorCodigo(codigo);



    setOrcamento(dados);


  }




  function abrirWhatsApp(numero) {

  const caminho = window.location.href;


  const mensagem =
`Olá! Tenho interesse neste modelo de anel de formatura.

Modelo: ${orcamento.modelo_anel}

Vi o orçamento pelo site:

${caminho}

Gostaria de mais informações.`;


  window.open(
    `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
    "_blank"
  );

}






  if (!orcamento) {

    return (

      <div>

        Carregando orçamento...

      </div>

    );

  }




  return (

  <div className="pagina-orcamento">



    <div className="cabecalho-orcamento">

      <h1>
        Ótica e Relojoaria Quatro Pontes
      </h1>


      <p>
        💍 Uma escolha especial para um momento único
      </p>


      <span>
        Proposta personalizada de Anel de Formatura
      </span>

    </div>





    <div className="card-orcamento">



      <h2>
        Olá, {orcamento.clientes?.nome_cliente}
      </h2>





      <p className="modelo">

        Modelo:

        <strong>
          {orcamento.modelo_anel}
        </strong>

      </p>





      {
        orcamento.imagem_url && (

          <img

            className="imagem-anel"

            src={orcamento.imagem_url}

            alt="Modelo do anel"

          />

        )
      }






      <div className="texto-orcamento">

        <pre>

          {orcamento.texto_orcamento}

        </pre>

      </div>





      <button

        className="botao-whatsapp"

        onClick={() => setMostrarWhatsApp(true)}

      >

        💬 Tenho interesse neste modelo

      </button>




    </div>





    {
      mostrarWhatsApp && (

        <div className="modal-whatsapp">


          <div className="conteudo-whatsapp">


            <h3>
              Escolha sua unidade
            </h3>



            <button

              onClick={() =>
                abrirWhatsApp("5545998193989")
              }

            >

              📍 Quatro Pontes

            </button>




            <button

              onClick={() =>
                abrirWhatsApp("5545999029779")
              }

            >

              📍 Novo Sarandi

            </button>





            <button

              onClick={() =>
                setMostrarWhatsApp(false)
              }

            >

              Cancelar

            </button>



          </div>


        </div>

      )
    }



  </div>

);


}


export default VisualizarOrcamento;