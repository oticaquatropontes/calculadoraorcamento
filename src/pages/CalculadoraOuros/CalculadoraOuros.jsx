import { useState } from "react";
import CalculadoraOuroTela from "./CalculadoraOuroTela";
import ConfigurarValoresOuro from "./ConfigurarValoresOuro";
import "./CalculadoraOuros.css";

function CalculadoraOuros({ voltar }) {

  const [tela, setTela] = useState("menu");

  if (tela === "calculadora") {
    return (
      <CalculadoraOuroTela
        voltar={() => setTela("menu")}
      />
    );
  }

  if (tela === "configurar") {
    return (
      <ConfigurarValoresOuro
        voltar={() => setTela("menu")}
      />
    );
  }

  return (
    <div className="container">

      <h1>🟡 Calculadora Ouros</h1>

      <button onClick={() => setTela("calculadora")}>
        🧮 Calculadora
      </button>

      <button onClick={() => setTela("configurar")}>
        ⚙️ Configurar Valores Ouro
      </button>

      <button className="voltar" onClick={voltar}>
        ⬅ Voltar
      </button>

    </div>
  );
}

export default CalculadoraOuros;