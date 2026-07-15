import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import AnelFormatura from "../AnelFormatura/AnelFormatura";
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


  if (tela === "aneis") {
    return <AnelFormatura voltar={() => setTela("inicio")} />;
  }


  return (
    <div className="container">

      <h1>Ótica e Relojoaria</h1>

      <h2>Quatro Pontes</h2>

      <p>Calculadora de Orçamentos</p>


      <button onClick={() => setTela("aneis")}>
        💍 Anéis de Formatura
      </button>


      <button>
        ⚙️ Configurações
      </button>


    </div>
  );
}

export default Home;