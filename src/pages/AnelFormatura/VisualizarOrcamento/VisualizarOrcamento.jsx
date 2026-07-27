import { useEffect, useState } from "react";
import { buscarOrcamentoPorId } from "../../../services/orcamentos";
import "./VisualizarOrcamento.css";


function VisualizarOrcamento() {


  const [orcamento, setOrcamento] = useState(null);


  useEffect(() => {

    carregarOrcamento();

  }, []);



  async function carregarOrcamento() {


    const parametros =
      new URLSearchParams(window.location.search);


    const id =
      parametros.get("id");



    console.log("ID RECEBIDO:", id);



    if (!id) {

      return;

    }



    const dados =
      await buscarOrcamentoPorId(id);



    setOrcamento(dados);


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
      >

        💬 Tenho interesse neste modelo

      </button>


    </div>


  </div>

);


}


export default VisualizarOrcamento;