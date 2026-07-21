import { useEffect, useState } from "react";
import {
  buscarValoresOuro,
  salvarValorOuro
} from "../../services/ouros";
import "./CalculadoraOuros.css";


function formatarInputValor(valor) {

  if (!valor) return "";


  const somenteNumeros = String(valor)
    .replace(/\D/g, "");


  if (!somenteNumeros) return "";


  const numero = Number(somenteNumeros) / 100;


  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

}



function formatarValorBanco(valor) {

  if (valor === undefined || valor === null || valor === "") {
    return "";
  }


  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

}





function ConfigurarValoresOuro({ voltar }) {


  const tipos = [

    {
      chave: "aliancas_lisas_416",
      nome: "Alianças lisas 416KT"
    },

    {
      chave: "aliancas_lisas_18",
      nome: "Alianças lisas 18KT"
    },

    {
      chave: "aliancas_trabalhadas_18",
      nome: "Alianças trabalhadas 18KT"
    },

    {
      chave: "fabricacao_416",
      nome: "Fabricação 416KT"
    },

    {
      chave: "fabricacao_18",
      nome: "Fabricação 18KT"
    },

    {
      chave: "correntes_416",
      nome: "Correntes/Pulseiras 416KT"
    },

    {
      chave: "correntes_18",
      nome: "Correntes/Pulseiras 18KT"
    },

    {
      chave: "correntes_prata",
      nome: "Correntes/Pulseiras Prata"
    },

    {
      chave: "ouro_venda",
      nome: "Ouro venda"
    },

    {
      chave: "prata_venda",
      nome: "Prata venda"
    }

  ];



  const [valores, setValores] = useState({});

  const [inputs, setInputs] = useState({});





  useEffect(() => {

    carregarValores();

  }, []);





  async function carregarValores() {


    const dados = await buscarValoresOuro();


    const novosValores = {};

    const novosInputs = {};



    dados.forEach(item => {


      novosValores[item.chave] = item.valor;


      novosInputs[item.chave] =
        formatarValorBanco(item.valor);


    });



    setValores(novosValores);

    setInputs(novosInputs);


  }






  function alterarValor(chave, valorFormatado) {


    setInputs({

      ...inputs,

      [chave]: valorFormatado

    });



    const valorNumerico = Number(

      String(valorFormatado)

        .replace(/\./g, "")

        .replace(",", ".")

    );



    setValores({

      ...valores,

      [chave]: isNaN(valorNumerico)
        ? 0
        : valorNumerico

    });


  }







  async function salvar() {


    for (const item of tipos) {


      await salvarValorOuro(

        item.chave,

        valores[item.chave] || 0

      );


    }


    alert("Valores ouro salvos com sucesso!");


  }







  return (

    <div className="container">


      <h1>
        ⚙️ Configurar Valores Ouro
      </h1>





      <div className="config-ouro-lista">


        {tipos.map(item => (


          <div

            key={item.chave}

            className="config-ouro-item"

          >


            <label>

              {item.nome}

            </label>




            <input


              value={

                inputs[item.chave] || ""

              }



              onChange={(e)=>{


                alterarValor(

                  item.chave,

                  formatarInputValor(
                    e.target.value
                  )

                );


              }}



              placeholder="Ex.: 100,00"


            />



          </div>


        ))}



      </div>





      <button onClick={salvar}>

        💾 Salvar Valores

      </button>






      <button

        className="voltar"

        onClick={voltar}

      >

        ⬅ Voltar

      </button>




    </div>

  );

}



export default ConfigurarValoresOuro;