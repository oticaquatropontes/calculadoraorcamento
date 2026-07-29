import { useEffect, useState } from "react";
import {
  buscarOuro18CPL,
  buscarOuro416CPL,
  salvarOuro18CPL,
  salvarOuro416CPL
} from "../../../services/configuracoes";


function ConfigurarValoresOuro({ voltar }) {


  const [ouro18, setOuro18] = useState("");
  const [ouro416, setOuro416] = useState("");

  const [salvando, setSalvando] = useState(false);



  useEffect(() => {

    carregarValores();

  }, []);




  async function carregarValores() {


  const valor18 =
    await buscarOuro18CPL();


  const valor416 =
    await buscarOuro416CPL();



  if(valor18 !== null){

    setOuro18(
      valor18.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );

  }



  if(valor416 !== null){

    setOuro416(
      valor416.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );

  }


}





  async function salvar() {


    setSalvando(true);



    const resultado18 =
      await salvarOuro18CPL(
  converterParaNumero(ouro18)
);



    const resultado416 =
      await salvarOuro416CPL(
  converterParaNumero(ouro416)
);


    setSalvando(false);



    if(resultado18 && resultado416){

      alert("Valores do ouro salvos com sucesso!");

    }


  }

function formatarMoeda(valor) {

  const numero = valor
    .replace(/\D/g, "");

  return (Number(numero) / 100)
    .toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

}

function converterParaNumero(valor) {

  return Number(
    valor
      .replace(/\./g, "")
      .replace(",", ".")
  );

}


  return (

    <div className="container">


      <h1>
        Valores do Ouro
      </h1>



      <p>
        Configure os valores utilizados nos cálculos das alianças CPL.
      </p>



      <label>
        Ouro 18KT
      </label>


      <input

  type="text"

  value={ouro18}

  onChange={(e)=>
    setOuro18(formatarMoeda(e.target.value))
  }

  placeholder="R$ 0,00"

/>





      <label>
        Ouro 416KT
      </label>


      <input

  type="text"

  value={ouro416}

  onChange={(e)=>
    setOuro416(formatarMoeda(e.target.value))
  }

  placeholder="R$ 0,00"

/>





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


export default ConfigurarValoresOuro;