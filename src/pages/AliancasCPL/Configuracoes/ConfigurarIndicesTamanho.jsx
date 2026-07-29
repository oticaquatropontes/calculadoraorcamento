import { useEffect, useState } from "react";
import {
  buscarIndicesTamanho,
  adicionarIndiceTamanho,
  editarIndiceTamanho,
  excluirIndiceTamanho
} from "../../../services/indicesTamanhoCPL";


function ConfigurarIndicesTamanho({ voltar }) {


  const [indices, setIndices] = useState([]);

  const [numeroDedo, setNumeroDedo] = useState("");
  const [indice, setIndice] = useState("");

  const [editando, setEditando] = useState(null);



  useEffect(() => {

    carregarIndices();

  }, []);




  async function carregarIndices() {

    const dados =
      await buscarIndicesTamanho();

    setIndices(dados);

  }






  async function salvar() {


    if(!numeroDedo || !indice){

      alert("Preencha todos os campos.");

      return;

    }



    let resultado;



    if(editando){


      resultado =
        await editarIndiceTamanho(
          editando,
          numeroDedo,
          indice
        );


    } else {


      resultado =
        await adicionarIndiceTamanho(
          numeroDedo,
          indice
        );


    }



    if(resultado){

      limparCampos();

      carregarIndices();

    }


  }






  function editar(item) {


    setNumeroDedo(
      item.numero_dedo
    );


    setIndice(
      item.indice
    );


    setEditando(
      item.id
    );


  }







  async function excluir(id) {


    const confirmar =
      window.confirm(
        "Deseja excluir este índice?"
      );


    if(!confirmar){

      return;

    }



    const resultado =
      await excluirIndiceTamanho(id);



    if(resultado){

      carregarIndices();

    }


  }







  function limparCampos(){

    setNumeroDedo("");

    setIndice("");

    setEditando(null);

  }






  return (

    <div className="container">

        <button onClick={voltar}>

  ⬅️ Voltar

</button>


      <h1>
        📏 Índices de Tamanho
      </h1>



      <label>
        Número do dedo
      </label>


      <input

        type="number"

        value={numeroDedo}

        onChange={(e)=>
          setNumeroDedo(e.target.value)
        }

        placeholder="Ex: 24"

      />





      <label>
        Índice
      </label>


      <input

        type="number"

        step="0.0001"

        value={indice}

        onChange={(e)=>
          setIndice(e.target.value)
        }

        placeholder="Ex: 1.100"

      />





      <button onClick={salvar}>

        {
          editando
          ?
          "💾 Salvar Alteração"
          :
          "➕ Adicionar Índice"
        }

      </button>





      {
        editando && (

          <button
            onClick={limparCampos}
          >

            Cancelar edição

          </button>

        )
      }






      <hr />





      <h2>
        Índices cadastrados
      </h2>





      {
        indices.map((item)=>(


          <div
            key={item.id}
            className="card-orcamento"
          >


            <p>
              Número:
              {" "}
              {item.numero_dedo}
            </p>



            <p>
              Índice:
              {" "}
              {
                Number(item.indice)
                  .toLocaleString("pt-BR", {
                    maximumFractionDigits: 4
                  })
              }
            </p>





            <button
              onClick={() => editar(item)}
            >

              ✏️ Editar

            </button>



            <button
              onClick={() => excluir(item.id)}
            >

              🗑️ Excluir

            </button>


          </div>


        ))
      }






      <button onClick={voltar}>

        ⬅️ Voltar

      </button>


    </div>

  );

}


export default ConfigurarIndicesTamanho;