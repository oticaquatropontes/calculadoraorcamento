import { useEffect, useState } from "react";
import {
  buscarConversaoOuro416,
  salvarConversaoOuro416
} from "../../../services/configuracoes";


function ConfigurarConversao416({ voltar }) {


  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);



  useEffect(() => {

    carregarValor();

  }, []);




  async function carregarValor() {


    const resultado =
      await buscarConversaoOuro416();



    if (resultado !== null) {

      setValor(resultado);

    }


  }





  async function salvar() {


    if (!valor) {

      alert("Informe a taxa de conversão.");

      return;

    }



    setSalvando(true);



    const resultado =
      await salvarConversaoOuro416(valor);



    setSalvando(false);



    if(resultado){

      alert("Taxa salva com sucesso!");

    }


  }





  return (

    <div className="container">


      <h1>
        Conversão Ouro 416KT
      </h1>



      <p>
        Informe a porcentagem de conversão do ouro 416KT
      </p>



      <input

        type="number"

        value={valor}

        onChange={(e)=>
          setValor(e.target.value)
        }

        placeholder="Digite a porcentagem"

      />



      <span>
        %
      </span>



      <button
        onClick={salvar}
        disabled={salvando}
      >

        {
          salvando
          ?
          "Salvando..."
          :
          "💾 Salvar"
        }

      </button>



      <button onClick={voltar}>

        ⬅️ Voltar

      </button>



    </div>

  );

}


export default ConfigurarConversao416;