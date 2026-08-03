import { useEffect, useState } from "react";

import { buscarOrcamentoCPLPorCodigo } from "../../services/orcamentosCPL";
import "./VisualizarOrcamentoCPL.css";

console.log("TESTE CPL NOVO");


function VisualizarOrcamentoCPL() {


  const [orcamento, setOrcamento] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [mostrarInteresse, setMostrarInteresse] = useState(false);



  useEffect(() => {

    carregarOrcamento();

  }, []);





  async function carregarOrcamento() {


    const caminho = window.location.pathname;


    const codigo =
      caminho.split("/")[2];



    console.log(
      "CÓDIGO CPL RECEBIDO:",
      codigo
    );



    if (!codigo) {
      return;
    }




    const dados =
      await buscarOrcamentoCPLPorCodigo(codigo);



    console.log(
      "DADOS RECEBIDOS NA TELA CPL:",
      dados
    );



    setOrcamento(dados);





    if (dados?.imagem_url) {

      setImagens(
        JSON.parse(dados.imagem_url)
      );

    }



    console.log(
      "IMAGEM SALVA:",
      dados?.imagem_url
    );


  }







if (!orcamento) {

  return (

    <div>
      Carregando orçamento CPL...
    </div>

  );

}








function extrairValoresModelo(texto, numeroModelo){


  if(!texto) return "";



  const partes =
    texto.split("═══════════════════════");



  let bloco =
    partes[numeroModelo] || "";



  bloco =
    bloco
    .replace(/MODELO\s+\d+/i,"")
    .replace(/Cliente:[\s\S]*?Tipo:/i,"")
    .replace(/Tipo:[\s\S]*/i,"")
    .trim();




  return bloco;


}







function extrairPeso(texto, numeroModelo){


  const bloco =
    extrairValoresModelo(
      texto,
      numeroModelo
    );



  const encontrado =
    bloco.match(
      /Peso:\s*([\d.,]+)\s*g/i
    );



  return encontrado
    ?
    encontrado[1]
    :
    null;


}







function extrairValorTexto(texto, numeroModelo){


  const bloco =
    extrairValoresModelo(
      texto,
      numeroModelo
    );



  return bloco
    .replace(
      /Peso:\s*[\d.,]+\s*g/i,
      ""
    )
    .trim();


}






function abrirInteresse(){

  setMostrarInteresse(true);

}






function chamarWhatsApp(unidade){

  let telefone = "";
  let nomeUnidade = "";



  if(unidade === "quatro"){

    telefone = "5545998193989";
    nomeUnidade = "Quatro Pontes";

  }



  if(unidade === "sarandi"){

    telefone = "5545999029779";
    nomeUnidade = "Novo Sarandi";

  }





  const linkOrcamento = window.location.href;


const mensagem = 
`Olá! Tenho interesse no orçamento de alianças que recebi. 💍


Cliente:
${orcamento.clientes?.nome_cliente}


Gostaria de continuar o atendimento pela unidade ${nomeUnidade}.


📄 Link do orçamento:
${linkOrcamento}`;





  window.open(
    `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`,
    "_blank"
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
        Proposta personalizada de alianças
      </span>


    </div>








    <div className="card-orcamento">



      <h2>
        Olá, {orcamento.clientes?.nome_cliente || "cliente"}!
      </h2>





      <div className="tipo-orcamento">

        <span>
          Tipo:
        </span>

        <strong>
          {orcamento.tipo_orcamento}
        </strong>

      </div>









      <div className="bloco-modelo">



        <h3>
          💍 Modelo 1
        </h3>




        <p className="nome-modelo">
          {orcamento.modelo_alianca_1}
        </p>





        {
          imagens[0] && (

            <img
              className="imagem-aliancas"
              src={imagens[0]}
              alt={orcamento.modelo_alianca_1}
            />

          )
        }








        <div className="informacoes-modelo">


          {
            extrairPeso(
              orcamento.texto_orcamento,
              1
            ) && (

              <p>
                ⚖️ Peso:
                {" "}
                <strong>
                  {
                    extrairPeso(
                      orcamento.texto_orcamento,
                      1
                    )
                  }
                  g
                </strong>
              </p>

            )
          }






          <div
            className="texto-orcamento"
            style={{ whiteSpace:"pre-line" }}
          >

            {
              extrairValorTexto(
                orcamento.texto_orcamento,
                1
              )
            }

          </div>




        </div>





      </div>









      {
        orcamento.modelo_alianca_2 && (


          <div className="bloco-modelo">



            <h3>
              💍 Modelo 2
            </h3>




            <p className="nome-modelo">
              {orcamento.modelo_alianca_2}
            </p>





            {
              imagens[1] && (

                <img
                  className="imagem-aliancas"
                  src={imagens[1]}
                  alt={orcamento.modelo_alianca_2}
                />

              )
            }








            <div className="informacoes-modelo">



              {
                extrairPeso(
                  orcamento.texto_orcamento,
                  2
                ) && (

                  <p>
                    ⚖️ Peso:
                    {" "}
                    <strong>
                      {
                        extrairPeso(
                          orcamento.texto_orcamento,
                          2
                        )
                      }
                      g
                    </strong>
                  </p>

                )
              }






              <div
                className="texto-orcamento"
                style={{ whiteSpace:"pre-line" }}
              >

                {
                  extrairValorTexto(
                    orcamento.texto_orcamento,
                    2
                  )
                }

              </div>



            </div>





          </div>


        )
      }









      {/* INTERESSE - FINAL DO ORÇAMENTO */}


      <div className="interesse">


        <button
          className="btn-interesse"
          onClick={abrirInteresse}
        >
          💍 Tenho interesse
        </button>





        {
          mostrarInteresse && (

            <div className="escolha-unidade">


              <h3>
                Com qual unidade deseja conversar?
              </h3>



              <button
                onClick={() => chamarWhatsApp("quatro")}
              >
                🏬 Quatro Pontes
              </button>




              <button
                onClick={() => chamarWhatsApp("sarandi")}
              >
                🏬 Novo Sarandi
              </button>





              <button
                onClick={() => setMostrarInteresse(false)}
              >
                ❌ Sair
              </button>




            </div>

          )
        }


      </div>





    </div>





  </div>

);


}


export default VisualizarOrcamentoCPL;