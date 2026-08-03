import { useEffect, useState } from "react";
import { buscarOrcamentosCPL } from "../../services/orcamentosCPL";


function ConsultarOrcamentos({ voltar }) {


  const [orcamentos, setOrcamentos] = useState([]);

  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);

  const [imagensModal, setImagensModal] = useState([]);


  const [buscaCliente, setBuscaCliente] = useState("");
  const [buscaModelo, setBuscaModelo] = useState("");
  const [buscaData, setBuscaData] = useState("");





  useEffect(() => {

    carregar();

  }, []);





  async function carregar() {

    const dados =
      await buscarOrcamentosCPL();


    console.log(
      "ORÇAMENTOS CPL:",
      dados
    );


    setOrcamentos(
      dados || []
    );

  }








  function abrirOrcamento(orcamento) {

    console.log(orcamento.texto_orcamento);


    setOrcamentoSelecionado(
      orcamento
    );


    if(orcamento.imagem_url){


      try {


        setImagensModal(
          JSON.parse(
            orcamento.imagem_url
          )
        );


      }catch(error){

        console.error(error);

        setImagensModal([]);

      }


    }else{

      setImagensModal([]);

    }


  }







  function extrairInformacaoModelo(texto, numeroModelo, nomeModelo){

  if(!texto) return "";

  const partes =
    texto.split("═══════════════════════");

  let bloco =
    partes[numeroModelo] || "";

  bloco = bloco

    .replace(/MODELO\s+\d+/gi,"")

    .replace(new RegExp(nomeModelo,"gi"),"")

    .replace(/Peso:\s*[\d.,]+\s*g/gi,"")

    .replace(/Data:[\s\S]*/gi,"")

    .replace(/\n\s*\n\s*\n+/g,"\n\n")

    .trim();

  return bloco;

}








  const orcamentosFiltrados =
    orcamentos.filter((orcamento)=>{


      const nomeCliente =
        orcamento.clientes?.nome_cliente
        ?.toLowerCase()
        ||
        "";



      const modelo =
        (
          orcamento.modelo_alianca_1
          +
          " "
          +
          orcamento.modelo_alianca_2
        )
        .toLowerCase();





      const data =
        orcamento.data_orcamento
        ?
        new Date(
          orcamento.data_orcamento
        )
        .toLocaleDateString("pt-BR")
        :
        "";




      return (

        nomeCliente.includes(
          buscaCliente.toLowerCase()
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









  function montarMensagem(orcamento){


    return (

`Olá, ${orcamento.clientes?.nome_cliente || "cliente"}!

Segue o orçamento das suas alianças:

Tipo:
${orcamento.tipo_orcamento}

Modelo 1:
${orcamento.modelo_alianca_1}


${
orcamento.modelo_alianca_2
?
`
Modelo 2:
${orcamento.modelo_alianca_2}
`
:
""}


Ficamos à disposição!
Será um prazer fazer parte desse momento especial.`

    );


  }






  function enviarWhatsApp(orcamento){


    const mensagem =
      montarMensagem(orcamento);



    window.open(

      `https://wa.me/?text=${encodeURIComponent(mensagem)}`,

      "_blank"

    );


  }







  async function copiarOrcamento(orcamento){


    const mensagem =
      montarMensagem(orcamento);



    await navigator.clipboard.writeText(
      mensagem
    );


    alert(
      "Orçamento copiado!"
    );


  }
    return (


    <div className="container">



      <button onClick={voltar}>
        ⬅️ Voltar
      </button>




      <h1>
        Consultar Orçamentos CPL
      </h1>





      <div className="filtros-orcamento">


        <input
          placeholder="Buscar por cliente"
          value={buscaCliente}
          onChange={(e)=>
            setBuscaCliente(e.target.value)
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


            let valor =
              e.target.value;


            valor =
              valor.replace(/\D/g,"");



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









      {
        orcamentosFiltrados.map((orcamento)=>(


          <div

            key={orcamento.id}

            className="card-orcamento"

          >



            <h3>
              {
                orcamento.clientes?.nome_cliente
                ||
                "Cliente não encontrado"
              }
            </h3>



            <p>
              Tipo:
              {" "}
              {orcamento.tipo_orcamento}
            </p>




            <p>

              Data:
              {" "}

              {
                new Date(
                  orcamento.data_orcamento
                )
                .toLocaleDateString("pt-BR")
              }

            </p>




            <p>
              Modelo 1:
              {" "}
              {orcamento.modelo_alianca_1}
            </p>



            {
              orcamento.modelo_alianca_2 && (

                <p>
                  Modelo 2:
                  {" "}
                  {orcamento.modelo_alianca_2}
                </p>

              )
            }





            <button

              onClick={() =>
                abrirOrcamento(orcamento)
              }

            >
              👁️ Ver orçamento
            </button>




            <button

              onClick={() =>
                enviarWhatsApp(orcamento)
              }

            >
              📲 WhatsApp
            </button>




            <button

              onClick={() =>
                copiarOrcamento(orcamento)
              }

            >
              📋 Copiar orçamento
            </button>



          </div>


        ))

      }












      {
        orcamentoSelecionado && (



          <div className="modal-orcamento">





            <h2 style={{ marginBottom: "25px" }}>
  💍 Orçamento de Alianças
</h2>



            <h3 style={{ marginBottom: "30px" }}>
  Cliente:{" "}
  {orcamentoSelecionado.clientes?.nome_cliente}
</h3>





            {
              orcamentoSelecionado.modelo_alianca_1 && (


                <div className="bloco-modelo">


                  <h2>
                    💍 Modelo 1
                  </h2>



                  <h3>
                    {
                      orcamentoSelecionado.modelo_alianca_1
                    }
                  </h3>





                  {
                    imagensModal[0] && (


                      <img

                        src={imagensModal[0]}

                        alt="Modelo 1"

                        className="imagem-aliancas"

                      />


                    )
                  }






                  <p>
                    ⚖️ Peso:
                    {" "}
                    {
                      orcamentoSelecionado.peso_alianca_1 || "-"
                    }
                    g
                  </p>





                 <div
  className="texto-modelo"
  style={{ whiteSpace: "pre-line" }}
>

{
  extrairInformacaoModelo(
  orcamentoSelecionado.texto_orcamento,
  1,
  orcamentoSelecionado.modelo_alianca_1
)
}

</div>




                </div>


              )

            }









            {
              orcamentoSelecionado.modelo_alianca_2 && (



                <div className="bloco-modelo">



                  <h2>
                    💍 Modelo 2
                  </h2>



                  <h3>
                    {
                      orcamentoSelecionado.modelo_alianca_2
                    }
                  </h3>





                  {
                    imagensModal[1] && (


                      <img

                        src={imagensModal[1]}

                        alt="Modelo 2"

                        className="imagem-aliancas"

                      />


                    )
                  }







                  <p>
                    ⚖️ Peso:
                    {" "}
                    {
                      orcamentoSelecionado.peso_alianca_2 || "-"
                    }
                    g
                  </p>





                  <div
  className="texto-modelo"
  style={{ whiteSpace: "pre-line" }}
>

{
  extrairInformacaoModelo(
  orcamentoSelecionado.texto_orcamento,
  2,
  orcamentoSelecionado.modelo_alianca_2
)
}

</div>





                </div>



              )

            }









            <button

              onClick={()=>{

                setOrcamentoSelecionado(null);

                setImagensModal([]);

              }}

            >

              ❌ Fechar

            </button>






          </div>



        )

      }







    </div>


  );


}


export default ConsultarOrcamentos;