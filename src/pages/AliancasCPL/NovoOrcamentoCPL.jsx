import { useEffect, useState } from "react";

import "./NovoOrcamentoCPL.css";

import {
  buscarClientesPorNome,
  buscarOuCriarCliente
} from "../../services/clientes";

import {
  buscarModelosCPL
} from "../../services/modelosAliancasCPL";

import {
  buscarIndicePorDedo
} from "../../services/indicesTamanhoCPL";

import {
  buscarOuro18CPL,
  buscarOuro416CPL,
  buscarConversaoOuro416
} from "../../services/configuracoes";

import {
  salvarOrcamentoCPL
} from "../../services/orcamentosCPL";



function NovoOrcamentoCPL({ voltar }) {



  // =========================
  // CLIENTE
  // =========================

  const [nomeCliente, setNomeCliente] = useState("");

  const [clientes, setClientes] = useState([]);

  const [clienteSelecionado, setClienteSelecionado] = useState(null);




  // =========================
  // TIPO ORÇAMENTO
  // =========================

  const [tipoOrcamento, setTipoOrcamento] = useState(null);




  // =========================
  // MODELOS
  // =========================

  const [modelos, setModelos] = useState([]);

  const [buscaModelo1, setBuscaModelo1] = useState("");

  const [buscaModelo2, setBuscaModelo2] = useState("");




  // =========================
  // ALIANÇA 1
  // =========================

  const [modelo1, setModelo1] = useState(null);

  const [numeroDedo1, setNumeroDedo1] = useState("");

  const [pesoCalculado1, setPesoCalculado1] = useState(null);

  const [valoresOuro1, setValoresOuro1] = useState(null);




  // =========================
  // ALIANÇA 2
  // =========================

  const [modelo2, setModelo2] = useState(null);

  const [numeroDedo2, setNumeroDedo2] = useState("");

  const [pesoCalculado2, setPesoCalculado2] = useState(null);

  const [valoresOuro2, setValoresOuro2] = useState(null);





  useEffect(() => {

    carregarModelos();

  }, []);






  async function carregarModelos(){

    const dados = await buscarModelosCPL();

    setModelos(dados);

  }







  // =========================
  // CALCULO OURO
  // =========================


  async function calcularValoresOuro(peso, modelo){


    const ouro18 =
      await buscarOuro18CPL();


    const ouro416 =
      await buscarOuro416CPL();


    const conversao416 =
      await buscarConversaoOuro416();




    if(
      !ouro18 ||
      !ouro416 ||
      conversao416 === null
    ){

      return null;

    }





    const resultado = {

      ouro18:null,

      ouro416:null,

      ouro18Zirconia:null,

      ouro416Zirconia:null,

      ouro18Brilhante:null,

      ouro416Brilhante:null

    };





    // OURO 18KT

    resultado.ouro18 =
      peso * ouro18;






    // OURO 416KT

    const peso416 =
  Number(
    (peso - (peso * conversao416 / 100))
    .toFixed(2)
  );



    resultado.ouro416 =
      peso416 * ouro416;






    // COM PEDRAS

    if(
      modelo &&
      modelo.possui_pedra
    ){


      if(modelo.indice_zirconia){

  resultado.ouro18Zirconia =
    (ouro18 * Number(modelo.indice_zirconia))
    * peso;


  resultado.ouro416Zirconia =
  (ouro416 * Number(modelo.indice_zirconia)) * peso416;

}





      if(modelo.indice_brilhante){


        resultado.ouro18Brilhante =
          ouro18 *
          Number(modelo.indice_brilhante) *
          peso;



        resultado.ouro416Brilhante =
          "Ouro 416KT não comporta brilhante.";


      }


    }




    return resultado;


  }









  // =========================
  // CLIENTES
  // =========================


  async function alterarCliente(valor){


    setNomeCliente(valor);

    setClienteSelecionado(null);



    if(valor.length < 2){

      setClientes([]);

      return;

    }



    const resultado =
      await buscarClientesPorNome(valor);



    setClientes(resultado);


  }








  function selecionarCliente(cliente){


    setClienteSelecionado(cliente);


    setNomeCliente(
      cliente.nome_cliente
    );


    setClientes([]);


  }








async function usarCliente(){

  if(!nomeCliente) return;


  const id =
    await buscarOuCriarCliente(
      nomeCliente
    );


  if(id){

    setClienteSelecionado({

      id:id,

      nome_cliente:nomeCliente

    });


    // limpa a sugestão
    setClientes([]);

  }

}

async function salvarOrcamento(){


  if(!clienteSelecionado){

    alert("Selecione ou cadastre um cliente antes de salvar.");

    return;

  }


  if(!modelo1){

    alert("Selecione pelo menos uma aliança.");

    return;

  }

function montarTextoValores(valores, modelo){

  if(!valores) return "";


  if(modelo.possui_pedra){

    let texto = "";


    if(valores.ouro18Brilhante){

      texto += `
Ouro 18KT c/ Brilhante:
R$ ${valores.ouro18Brilhante.toFixed(2)}

⚠️ Ouro 416KT não comporta brilhante.

`;

    }


    if(valores.ouro18Zirconia){

      texto += `
Ouro 18KT c/ Zircônia:
R$ ${valores.ouro18Zirconia.toFixed(2)}

Ouro 416KT c/ Zircônia:
R$ ${valores.ouro416Zirconia.toFixed(2)}

`;

    }


    return texto;

  }


  return `
Ouro 18KT:
R$ ${valores.ouro18.toFixed(2)}

Ouro 416KT:
R$ ${valores.ouro416.toFixed(2)}

`;

}

  const texto = `

Ótica e Relojoaria Quatro Pontes

Orçamento CPL


Cliente:
${nomeCliente}


Tipo:
${tipoOrcamento}


Aliança 1:
${modelo1.nome_modelo}

Peso:
${pesoCalculado1} g

${valoresOuro1 ? `

Valores Aliança 1:

${montarTextoValores(valoresOuro1, modelo1)}

` : ""}


${modelo2 ? `

Aliança 2:
${modelo2.nome_modelo}

Peso:
${pesoCalculado2} g

${valoresOuro2 ? `

Valores Aliança 2:

${montarTextoValores(valoresOuro2, modelo2)}

` : ""}

` : ""}


Data:
${new Date().toLocaleDateString("pt-BR")}

`;




  const valorTotal =
    (valoresOuro1?.ouro18 || 0) +
    (valoresOuro2?.ouro18 || 0);




  const resultado =
    await salvarOrcamentoCPL({

      cliente_id:
        clienteSelecionado.id,

      tipo_orcamento:
        tipoOrcamento,

      modelo_alianca_1:
        modelo1.nome_modelo,

      modelo_alianca_2:
        modelo2?.nome_modelo || null,

        imagem_url:
  JSON.stringify([
    modelo1.foto,
    modelo2?.foto || null
  ]),

      data_orcamento:
        new Date()
        .toISOString()
        .split("T")[0],

      peso_alianca_1:
  pesoCalculado1 ? Number(pesoCalculado1) : null,

      peso_alianca_2:
  pesoCalculado2 ? Number(pesoCalculado2) : null,

      valor_orcamento:
        valorTotal,

      texto_orcamento:
        texto

    });



  if(resultado){

    alert("Orçamento salvo com sucesso!");

  }


}









  // =========================
  // MODELOS
  // =========================


  function selecionarModelo(item, lado){



    if(lado === 1){

      setModelo1(item);

      setBuscaModelo1("");

    }else{


      setModelo2(item);

      setBuscaModelo2("");

    }


  }









  async function calcularPeso(modelo, numero, lado){


    if(!modelo || !numero){


      if(lado === 1){

        setPesoCalculado1(null);

        setValoresOuro1(null);

      }else{

        setPesoCalculado2(null);

        setValoresOuro2(null);

      }


      return;


    }






    const indice =
      await buscarIndicePorDedo(numero);




    if(!indice){


      if(lado === 1){

        setPesoCalculado1(null);

        setValoresOuro1(null);

      }else{

        setPesoCalculado2(null);

        setValoresOuro2(null);

      }


      return;


    }







    const peso =
      Number(modelo.peso) *
      Number(indice);





    const valores =
      await calcularValoresOuro(
        peso,
        modelo
      );






    if(lado === 1){


      setPesoCalculado1(
        peso.toFixed(2)
      );


      setValoresOuro1(valores);



    }else{


      setPesoCalculado2(
        peso.toFixed(2)
      );


      setValoresOuro2(valores);



    }


  }









  function filtrarModelos(busca){


    return modelos.filter((item)=>

      item.nome_modelo
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )

    );


  }









  function mostrarResultadoOuro(valores, modelo){


    if(!valores) return null;





    if(modelo.possui_pedra){


      return (

        <>


          {valores.ouro18Brilhante && (

            <p>
              <strong>
                Ouro 18KT c/ Brilhante:
              </strong>{" "}
              R$ {valores.ouro18Brilhante.toFixed(2)}
            </p>

          )}






          {valores.ouro18Zirconia && (

            <p>
              <strong>
                Ouro 18KT c/ Zircônia:
              </strong>{" "}
              R$ {valores.ouro18Zirconia.toFixed(2)}
            </p>

          )}






          {valores.ouro416Zirconia && (

            <p>
              <strong>
                Ouro 416KT c/ Zircônia:
              </strong>{" "}
              R$ {valores.ouro416Zirconia.toFixed(2)}
            </p>

          )}






          {valores.ouro416Brilhante && (

            <p>
              ⚠️ {valores.ouro416Brilhante}
            </p>

          )}



        </>

      );


    }






    return (

      <>


        <p>
          <strong>
            Ouro 18KT:
          </strong>{" "}
          R$ {valores.ouro18.toFixed(2)}
        </p>




        <p>
          <strong>
            Ouro 416KT:
          </strong>{" "}
          R$ {valores.ouro416.toFixed(2)}
        </p>



      </>

    );



  }

    return (

    <div className="container">


      <h1>
        💍 Novo Orçamento CPL
      </h1>



     {/* CLIENTE */}

<label>
  Cliente
</label>


<div className="campo-cliente">

  <input

    type="text"

    value={nomeCliente}

    placeholder="Digite o nome do cliente"

    onChange={(e)=>
      alterarCliente(e.target.value)
    }

  />


  {
  !clienteSelecionado &&
  (clientes.length > 0 || nomeCliente.length >= 2) && (

      <div className="lista-clientes">

        {
          clientes.length > 0 ? (

            clientes.map((cliente)=>(

              <div

                key={cliente.id}

                className="item-cliente"

                onClick={() =>
                  selecionarCliente(cliente)
                }

              >

                {cliente.nome_cliente}

              </div>

            ))

          ) : (

            <div

              className="item-cliente novo"

              onClick={() =>
                usarCliente()
              }

            >

              ➕ Usar: {nomeCliente}

            </div>

          )

        }

      </div>

    )
  }

</div>



      {/* TIPO */}

      <p className="titulo-pedra">
        Tipo de orçamento
      </p>



      <div className="cards-pedra">


        <div

          className={
            tipoOrcamento === "individual"
            ?
            "card-pedra selecionado"
            :
            "card-pedra"
          }

          onClick={() =>
            setTipoOrcamento("individual")
          }

        >

          <span>
            💍
          </span>

          <strong>
            Individual
          </strong>

        </div>





        <div

          className={
            tipoOrcamento === "par"
            ?
            "card-pedra selecionado"
            :
            "card-pedra"
          }

          onClick={() =>
            setTipoOrcamento("par")
          }

        >

          <span>
            💍💍
          </span>

          <strong>
            Par
          </strong>

        </div>


      </div>









      {
        tipoOrcamento && (

          <div

            className={
              tipoOrcamento === "par"
              ?
              "area-par"
              :
              ""
            }

          >








            {/* ======================
                ALIANÇA 1
            ======================= */}



            <div className="bloco-alianca">


              <h2>
                Aliança 1
              </h2>



              <label>
                Modelo
              </label>



              <input

                type="text"

                placeholder="Pesquisar modelo"

                value={buscaModelo1}

                onChange={(e)=>
                  setBuscaModelo1(e.target.value)
                }

              />





              {
                buscaModelo1 && (

                  <div className="lista-modelos">


                    {
                      filtrarModelos(buscaModelo1)
                      .map((modelo)=>(


                        <div

                          key={modelo.id}

                          className="item-modelo"

                          onClick={() =>
                            selecionarModelo(
                              modelo,
                              1
                            )
                          }

                        >

                          {modelo.nome_modelo}

                        </div>


                      ))
                    }


                  </div>

                )
              }





              {
                modelo1 && (


                  <div className="modelo-selecionado">


                    <img

                      src={modelo1.foto}

                      alt={modelo1.nome_modelo}

                    />



                    <h3>
                      {modelo1.nome_modelo}
                    </h3>



                    <p>
                      Largura:
                      {modelo1.largura} mm
                    </p>


                    <p>
                      Altura:
                      {modelo1.altura} mm
                    </p>



                    <p>
                      Numeração do dedo
                    </p>




                    <input

                      type="text"

                      inputMode="numeric"

                      value={numeroDedo1}

                      placeholder="Informe o número"

                      onChange={(e)=>{


                        const valor =
                          e.target.value;


                        setNumeroDedo1(valor);



                        calcularPeso(
                          modelo1,
                          valor,
                          1
                        );


                      }}

                    />





                    <p>

                      Peso:

                      <strong>

                        {
                          pesoCalculado1
                          ?
                          `${pesoCalculado1} g`
                          :
                          "Informe a numeração"
                        }

                      </strong>

                    </p>




                    {
                      valoresOuro1 && (

                        <div className="resultado-ouro">

                          {
                            mostrarResultadoOuro(
                              valoresOuro1,
                              modelo1
                            )
                          }

                        </div>

                      )
                    }



                  </div>

                )
              }



            </div>










            {/* ======================
                ALIANÇA 2
            ======================= */}



            {
              tipoOrcamento === "par" && (


                <div className="bloco-alianca">


                  <h2>
                    Aliança 2
                  </h2>




                  <label>
                    Modelo
                  </label>




                  <input

                    type="text"

                    placeholder="Pesquisar modelo"

                    value={buscaModelo2}

                    onChange={(e)=>
                      setBuscaModelo2(e.target.value)
                    }

                  />





                  {
                    buscaModelo2 && (

                      <div className="lista-modelos">


                        {
                          filtrarModelos(buscaModelo2)
                          .map((modelo)=>(


                            <div

                              key={modelo.id}

                              className="item-modelo"

                              onClick={() =>
                                selecionarModelo(
                                  modelo,
                                  2
                                )
                              }

                            >

                              {modelo.nome_modelo}


                            </div>


                          ))
                        }


                      </div>

                    )
                  }





                  {
                    modelo2 && (


                      <div className="modelo-selecionado">


                        <img

                          src={modelo2.foto}

                          alt={modelo2.nome_modelo}

                        />



                        <h3>
                          {modelo2.nome_modelo}
                        </h3>



                        <p>
                          Largura:
                          {modelo2.largura} mm
                        </p>



                        <p>
                          Altura:
                          {modelo2.altura} mm
                        </p>





                        <p>
                          Numeração do dedo
                        </p>





                        <input

                          type="text"

                          inputMode="numeric"

                          value={numeroDedo2}

                          placeholder="Informe o número"

                          onChange={(e)=>{


                            const valor =
                              e.target.value;


                            setNumeroDedo2(valor);



                            calcularPeso(
                              modelo2,
                              valor,
                              2
                            );


                          }}

                        />





                        <p>

                          Peso:

                          <strong>

                            {
                              pesoCalculado2
                              ?
                              `${pesoCalculado2} g`
                              :
                              "Informe a numeração"
                            }

                          </strong>


                        </p>





                        {
                          valoresOuro2 && (

                            <div className="resultado-ouro">

                              {
                                mostrarResultadoOuro(
                                  valoresOuro2,
                                  modelo2
                                )
                              }


                            </div>

                          )
                        }



                      </div>


                    )
                  }





                </div>


              )
            }





          </div>

        )
      }




        <button
  className="btn-salvar"
  onClick={salvarOrcamento}
>
  💾 Salvar orçamento
</button>



      <button

        className="btn-voltar"

        onClick={voltar}

      >

        ⬅️ Voltar

      </button>





    </div>

  );

}


export default NovoOrcamentoCPL;