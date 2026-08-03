import { useEffect, useState } from "react";

import {
  buscarConversaoOuro416,
  salvarConversaoOuro416,
  buscarConversaoOuro250,
  salvarConversaoOuro250
} from "../../../services/configuracoes";

function ConfigurarConversao416({ voltar }) {

  const [valor416, setValor416] = useState("");
  const [valor250, setValor250] = useState("");

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {

    carregarValores();

  }, []);

  async function carregarValores() {

    const conversao416 =
      await buscarConversaoOuro416();

    const conversao250 =
      await buscarConversaoOuro250();

    if (conversao416 !== null) {

      setValor416(conversao416);

    }

    if (conversao250 !== null) {

      setValor250(conversao250);

    }

  }

  async function salvar() {

    if (valor416 === "" || valor250 === "") {

      alert("Informe as duas taxas de conversão.");

      return;

    }

    setSalvando(true);

    await salvarConversaoOuro416(valor416);

    await salvarConversaoOuro250(valor250);

    setSalvando(false);

    alert("Taxas salvas com sucesso!");

  }

  return (

    <div className="container">

      <h1>

        Conversão dos Ouros

      </h1>

      <label>

        Conversão Ouro 416KT (%)

      </label>

      <input

        type="number"

        value={valor416}

        onChange={(e)=>
          setValor416(e.target.value)
        }

        placeholder="Digite a porcentagem"

      />

      <label
        style={{ marginTop: "20px" }}
      >

        Conversão Ouro 250KT (%)

      </label>

      <input

        type="number"

        value={valor250}

        onChange={(e)=>
          setValor250(e.target.value)
        }

        placeholder="Digite a porcentagem"

      />

      <button

        onClick={salvar}

        disabled={salvando}

        style={{ marginTop: "25px" }}

      >

        {

          salvando

            ?

            "Salvando..."

            :

            "💾 Salvar"

        }

      </button>

      <button

        onClick={voltar}

      >

        ⬅️ Voltar

      </button>

    </div>

  );

}

export default ConfigurarConversao416;