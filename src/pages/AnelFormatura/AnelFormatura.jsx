import { useState } from "react";
import NovoOrcamento from "./NovoOrcamento/NovoOrcamento";
import ConfiguracaoIndice from "./ConfiguracaoIndice/ConfiguracaoIndice";
import "./AnelFormatura.css";


function AnelFormatura({ voltar }) {

  const [tela, setTela] = useState("inicio");


  if (tela === "orcamento") {
    return (
      <NovoOrcamento
        voltar={() => setTela("inicio")}
      />
    );
  }


  if (tela === "configuracao") {
    return (
      <ConfiguracaoIndice
        voltar={() => setTela("inicio")}
      />
    );
  }


  return (
    <div className="container">

      <h1>💍 Anéis de Formatura</h1>


      <button onClick={() => setTela("configuracao")}>
        ⚙️ Configuração do Índice
      </button>


      <button onClick={() => setTela("orcamento")}>
        🧾 Novo Orçamento
      </button>


      <button className="voltar" onClick={voltar}>
        ⬅ Voltar
      </button>


    </div>
  );
}

export default AnelFormatura;