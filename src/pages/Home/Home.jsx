import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { sair } from "../../services/auth";

import AnelFormatura from "../AnelFormatura/AnelFormatura";
import AliancasCPL from "../AliancasCPL/AliancasCPL";
import CalculadoraOuros from "../CalculadoraOuros/CalculadoraOuros";

import "./Home.css";

function Home() {

  const [tela, setTela] = useState("inicio");

  useEffect(() => {
    buscarClientes();
  }, []);

  async function buscarClientes() {

    const { data, error } = await supabase
      .from("clientes")
      .select("*");

    console.log("Clientes:", data);
    console.log("Erro:", error);

  }

  async function fazerLogout() {

    await sair();
    window.location.reload();

  }

  // ===========================
  // MÓDULO ANÉIS DE FORMATURA
  // ===========================

  if (tela === "aneis") {

    return (
      <AnelFormatura
        voltar={() => setTela("inicio")}
      />
    );

  }

  // ===========================
  // MÓDULO ALIANÇAS CPL
  // ===========================

  if (tela === "aliancas") {

    return (
      <AliancasCPL
        voltar={() => setTela("inicio")}
      />
    );

  }

  // ===========================
  // CALCULADORA DE OURO
  // ===========================

  if (tela === "ouros") {

    return (
      <CalculadoraOuros
        voltar={() => setTela("inicio")}
      />
    );

  }

  return (

    <div className="container">

      <h1>
        Ótica e Relojoaria
      </h1>

      <h2>
        Quatro Pontes
      </h2>

      <p>
        Calculadora de Orçamentos
      </p>

      <button onClick={() => setTela("aneis")}>
        💍 Anéis de Formatura
      </button>

      <button onClick={() => setTela("aliancas")}>
        💍 Alianças CPL
      </button>

      <button onClick={() => setTela("ouros")}>
        🟡 Calculadora Ouros
      </button>

      <button>
        ⚙️ Configurações
      </button>

      <button onClick={fazerLogout}>
        🚪 Sair
      </button>

    </div>

  );

}

export default Home;