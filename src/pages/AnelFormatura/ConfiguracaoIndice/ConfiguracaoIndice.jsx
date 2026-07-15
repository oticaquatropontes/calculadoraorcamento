import { useState } from "react";
import { supabase } from "../../../supabase";
import "./ConfiguracaoIndice.css";


function ConfiguracaoIndice({ voltar }) {


  const [indice, setIndice] = useState("");



  async function salvarIndice() {


  const valor = Number(
    indice
      .replace(/\./g, "")
      .replace(",", ".")
  );


  const { error } = await supabase
    .from("configuracoes")
    .update({
      valor: valor
    })
    .eq("nome", "indice_geral");



  if (error) {

    console.log(error);

    alert("Erro ao salvar índice");

    return;

  }


  alert("Índice salvo com sucesso!");

}





  return (

    <div className="container">


      <h1>⚙️ Configuração do Índice</h1>


      <label>
        Valor do Índice de Cálculo (R$)
      </label>



      <input

        type="text"

        value={indice}

        onChange={(e)=>{

          let valor = e.target.value;


          valor = valor.replace(/\D/g,"");


          valor = (
            Number(valor) / 100
          ).toLocaleString("pt-BR",{

            minimumFractionDigits:2

          });


          setIndice(valor);


        }}

      />



      <button onClick={salvarIndice}>
        SALVAR
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


export default ConfiguracaoIndice;