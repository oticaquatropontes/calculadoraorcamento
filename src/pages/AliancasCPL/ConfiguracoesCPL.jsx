import { useState } from "react";
import ConfigurarConversao416 from "./Configuracoes/ConfigurarConversao416";
import ConfigurarValoresOuro from "./Configuracoes/ConfigurarValoresOuro";
import ConfigurarIndicesTamanho from "./Configuracoes/ConfigurarIndicesTamanho";


function ConfiguracoesCPL({ voltar }) {


  const [tela, setTela] = useState("inicio");



  if (tela === "conversao416") {

    return (

      <ConfigurarConversao416

        voltar={() => setTela("inicio")}

      />

    );

  }

  if (tela === "valoresOuro") {

  return (

    <ConfigurarValoresOuro

      voltar={() => setTela("inicio")}

    />

  );

}

if (tela === "indicesTamanho") {

  return (

    <ConfigurarIndicesTamanho
      voltar={() => setTela("inicio")}
    />

  );

}



  return (

    <div className="container">


      <h1>
        Configurações
      </h1>



      <button
  onClick={() => setTela("indicesTamanho")}
>

  📏 Configurar Índices de Tamanho

</button>



      <button
  onClick={() => setTela("valoresOuro")}
>

  💰 Configurar Valor do Ouro

</button>



      <button
        onClick={() => setTela("conversao416")}
      >

        ⚙️ Configurar Taxas de Conversão

      </button>



      <button onClick={voltar}>
        ⬅️ Voltar
      </button>


    </div>

  );

}


export default ConfiguracoesCPL;