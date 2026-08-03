import { useState } from "react";
import ConfiguracoesCPL from "./ConfiguracoesCPL";
import CadastroModelosCPL from "./CadastroModelosCPL";
import NovoOrcamentoCPL from "./NovoOrcamentoCPL";
import ConsultarOrcamentos from "./ConsultarOrcamentos";


function AliancasCPL({ voltar }) {


  const [tela, setTela] = useState("inicio");



  if (tela === "configuracoes") {

    return (
      <ConfiguracoesCPL
        voltar={() => setTela("inicio")}
      />
    );

  }



  if (tela === "modelos") {

    return (
      <CadastroModelosCPL
        voltar={() => setTela("inicio")}
      />
    );

  }



  if (tela === "novo-orcamento") {

    return (
      <NovoOrcamentoCPL
        voltar={() => setTela("inicio")}
      />
    );

  }



  if (tela === "consultar") {

    return (
      <ConsultarOrcamentos
        voltar={() => setTela("inicio")}
      />
    );

  }




  return (

    <div className="container">

      <h1>
        Alianças CPL
      </h1>



      <button
        onClick={() => setTela("novo-orcamento")}
      >
        📝 Novo Orçamento
      </button>



      <button
        onClick={() => setTela("consultar")}
      >
        📂 Consultar Orçamentos
      </button>



      <button
        onClick={() => setTela("modelos")}
      >
        💍 Adicionar Modelos
      </button>



      <button
        onClick={() => setTela("configuracoes")}
      >
        ⚙️ Configurações
      </button>



      <button
        onClick={voltar}
      >
        ⬅️ Voltar
      </button>



    </div>

  );

}


export default AliancasCPL;