import { useEffect, useState } from "react";
import "./CadastroModelosCPL.css";

import {
  uploadFotoModeloCPL,
  adicionarModeloCPL,
  buscarModelosCPL,
  editarModeloCPL,
  excluirModeloCPL
} from "../../services/modelosAliancasCPL";



function CadastroModelosCPL({ voltar }) {



  const [foto, setFoto] = useState(null);

  const [nomeModelo, setNomeModelo] = useState("");

  const [largura, setLargura] = useState("");

  const [altura, setAltura] = useState("");

  const [peso, setPeso] = useState("");

  const [possuiPedra, setPossuiPedra] = useState(null);

  const [indiceZirconia, setIndiceZirconia] = useState("");

  const [indiceBrilhante, setIndiceBrilhante] = useState("");



  const [modelos, setModelos] = useState([]);

  const [busca, setBusca] = useState("");



  const [modeloEditando, setModeloEditando] = useState(null);







  useEffect(() => {

    carregarModelos();

  }, []);







  async function carregarModelos(){

    const dados =
      await buscarModelosCPL();

    setModelos(dados);

  }









  function formatarEntrada(valor){

    return valor
      .replace(".", ",")
      .replace(/[^\d,]/g, "")
      .replace(/(,.*),/g, "$1");

  }









  function converterNumero(valor){

    if(!valor){

      return null;

    }


    return Number(
      valor.replace(",", ".")
    );

  }









  const formularioCompleto =
    foto &&
    nomeModelo &&
    largura &&
    altura &&
    peso &&
    possuiPedra !== null &&
    (
      possuiPedra === false ||
      (
        indiceZirconia &&
        indiceBrilhante
      )
    );









  async function salvarModelo(){



    let urlFoto = null;



    if(foto){

      urlFoto =
        await uploadFotoModeloCPL(foto);

    }



    if(!urlFoto){

      alert("Erro ao enviar foto.");

      return;

    }






    const dados = {


      nome_modelo: nomeModelo,


      foto: urlFoto,


      largura:
        converterNumero(largura),


      altura:
        converterNumero(altura),


      peso:
        converterNumero(peso),


      possui_pedra: possuiPedra,



      indice_zirconia:

        possuiPedra

        ? converterNumero(indiceZirconia)

        : null,



      indice_brilhante:

        possuiPedra

        ? converterNumero(indiceBrilhante)

        : null


    };






    let resultado;





    if(modeloEditando){


      resultado =
        await editarModeloCPL(
          modeloEditando,
          dados
        );


    }else{


      resultado =
        await adicionarModeloCPL(
          dados
        );


    }







    if(resultado){


      alert(
        modeloEditando
        ?
        "Modelo atualizado com sucesso!"
        :
        "Modelo salvo com sucesso!"
      );



      carregarModelos();


      limparFormulario();


    }



  }








  function limparFormulario(){


    setFoto(null);

    setNomeModelo("");

    setLargura("");

    setAltura("");

    setPeso("");

    setPossuiPedra(null);

    setIndiceZirconia("");

    setIndiceBrilhante("");

    setModeloEditando(null);


  }









  function alterarPossuiPedra(valor){


    setPossuiPedra(valor);



    if(!valor){

      setIndiceZirconia("");

      setIndiceBrilhante("");

    }


  }
    function editarModelo(item){


    setModeloEditando(item.id);


    setNomeModelo(item.nome_modelo);


    setLargura(
      String(item.largura)
      .replace(".", ",")
    );


    setAltura(
      String(item.altura)
      .replace(".", ",")
    );


    setPeso(
      String(item.peso)
      .replace(".", ",")
    );


    setPossuiPedra(item.possui_pedra);



    if(item.possui_pedra){


      setIndiceZirconia(

        String(item.indice_zirconia)
        .replace(".", ",")

      );


      setIndiceBrilhante(

        String(item.indice_brilhante)
        .replace(".", ",")

      );


    }else{


      setIndiceZirconia("");

      setIndiceBrilhante("");

    }



    window.scrollTo({

      top:0,

      behavior:"smooth"

    });


  }








  async function excluirModelo(id){


    const confirmar =
      window.confirm(
        "Deseja realmente excluir este modelo?"
      );



    if(!confirmar){

      return;

    }





    const resultado =
      await excluirModeloCPL(id);




    if(resultado){


      alert(
        "Modelo excluído com sucesso!"
      );


      carregarModelos();


    }


  }










  return (


    <div className="container">



      <h1>
        💍 Cadastro de Modelos CPL
      </h1>

      <button

  className="btn-voltar"

  onClick={voltar}

>

  ⬅️ Voltar

</button>





      <label>
        Foto do modelo
      </label>


      <input

        type="file"

        accept="image/*"

        onChange={(e)=>
          setFoto(e.target.files[0])
        }

      />









      <label>
        Nome do modelo
      </label>


      <input

        type="text"

        value={nomeModelo}

        onChange={(e)=>
          setNomeModelo(e.target.value)
        }

      />









      <label>
        Largura (mm)
      </label>


      <input

        type="text"

        inputMode="decimal"

        value={largura}

        onChange={(e)=>
          setLargura(
            formatarEntrada(
              e.target.value
            )
          )
        }

      />









      <label>
        Altura (mm)
      </label>


      <input

        type="text"

        inputMode="decimal"

        value={altura}

        onChange={(e)=>
          setAltura(
            formatarEntrada(
              e.target.value
            )
          )
        }

      />









      <label>
        Peso (gramas)
      </label>


      <input

        type="text"

        inputMode="decimal"

        value={peso}

        onChange={(e)=>
          setPeso(
            formatarEntrada(
              e.target.value
            )
          )
        }

      />










      <p className="titulo-pedra">
        Possui pedra?
      </p>





      <div className="cards-pedra">



        <div

          className={
            possuiPedra === true
            ?
            "card-pedra selecionado"
            :
            "card-pedra"
          }


          onClick={() =>
            alterarPossuiPedra(true)
          }

        >

          <span>
            💎
          </span>


          <strong>
            Com pedra
          </strong>


        </div>








        <div

          className={
            possuiPedra === false
            ?
            "card-pedra selecionado"
            :
            "card-pedra"
          }


          onClick={() =>
            alterarPossuiPedra(false)
          }

        >

          <span>
            ❌
          </span>


          <strong>
            Sem pedra
          </strong>


        </div>



      </div>










      {
        possuiPedra && (


          <>


            <label>
              Índice Zirconia
            </label>


            <input

              type="text"

              inputMode="decimal"

              value={indiceZirconia}

              onChange={(e)=>
                setIndiceZirconia(
                  formatarEntrada(
                    e.target.value
                  )
                )
              }

            />







            <label>
              Índice Brilhante
            </label>


            <input

              type="text"

              inputMode="decimal"

              value={indiceBrilhante}

              onChange={(e)=>
                setIndiceBrilhante(
                  formatarEntrada(
                    e.target.value
                  )
                )
              }

            />



          </>


        )
      }









      {
        formularioCompleto && (


          <button

            className="btn-salvar"

            onClick={salvarModelo}

          >


            {
              modeloEditando
              ?
              "🔄 Atualizar Modelo"
              :
              "💾 Salvar Modelo"
            }


          </button>


        )
      }









      <hr />







      <h2 className="titulo-lista">
        📂 Modelos cadastrados
      </h2>







      <input

        type="text"

        placeholder="🔎 Consultar modelo..."

        value={busca}

        onChange={(e)=>
          setBusca(
            e.target.value
          )
        }

      />









      <div className="lista-modelos">


      {


        modelos

        .filter((item)=>

          item.nome_modelo
          .toLowerCase()
          .includes(
            busca.toLowerCase()
          )

        )


        .map((item)=>(



          <div

            key={item.id}

            className="card-modelo"

          >



            <img

              src={item.foto}

              alt={item.nome_modelo}

            />





            <h3>
              {item.nome_modelo}
            </h3>





            <p>
              Largura: {item.largura} mm
            </p>



            <p>
              Altura: {item.altura} mm
            </p>



            <p>
              Peso: {item.peso} g
            </p>





            <p>

              {
                item.possui_pedra
                ?
                "💎 Com pedra"
                :
                "❌ Sem pedra"
              }

            </p>







            <button

              className="btn-editar"

              onClick={() =>
                editarModelo(item)
              }

            >

              ✏️ Editar

            </button>







            <button

              className="btn-excluir"

              onClick={() =>
                excluirModelo(item.id)
              }

            >

              🗑️ Excluir

            </button>





          </div>



        ))


      }


      </div>









      <button

        className="btn-voltar"

        onClick={voltar}

      >

        ⬅️ Voltar

      </button>






    </div>


  );


}



export default CadastroModelosCPL;