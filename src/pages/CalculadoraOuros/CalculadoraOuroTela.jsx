import { useState, useEffect } from "react";
import { buscarValoresOuro } from "../../services/ouros";
import "./CalculadoraOuros.css";

function CalculadoraOuroTela({ voltar }) {

 const tipos = [
  { chave: "aliancas_lisas_416", nome: "Alianças lisas 416KT" },
  { chave: "aliancas_lisas_18", nome: "Alianças lisas 18KT" },
  { chave: "aliancas_trabalhadas_18", nome: "Alianças trabalhadas 18KT" },
  { chave: "fabricacao_416", nome: "Fabricação 416KT" },
  { chave: "fabricacao_18", nome: "Fabricação 18KT" },
  { chave: "correntes_416", nome: "Correntes/Pulseiras 416KT" },
  { chave: "correntes_18", nome: "Correntes/Pulseiras 18KT" },
  { chave: "correntes_prata", nome: "Correntes/Pulseiras Prata" },
  { chave: "ouro_venda", nome: "Ouro venda" },
  { chave: "prata_venda", nome: "Prata venda" }
];

  

  const [tiposSelecionados, setTiposSelecionados] = useState([]);
  const [peso, setPeso] = useState("");

  const [valoresConfig, setValoresConfig] = useState({});


useEffect(() => {

  carregarValores();

}, []);

function limparCalculadora() {

  setTiposSelecionados([]);

  setPeso("");

}



async function carregarValores() {

  const dados = await buscarValoresOuro();


  const objeto = {};


  dados.forEach((item)=>{

    objeto[item.chave] = item.valor;

  });


  setValoresConfig(objeto);

}

  function alternarTipo(chave) {

    setTiposSelecionados((anterior) =>

      anterior.includes(chave)

        ? anterior.filter((t) => t !== chave)

        : [...anterior, chave]

    );

  }

  function formatarValor(valor) {

    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  }

  const pesoNumero = Number(String(peso).replace(",", ".")) || 0;

  const resultados = tiposSelecionados.map((chave) => {

    const tipo = tipos.find((t) => t.chave === chave);
    const valorBase = valoresConfig[chave] || 0;

    return {
      chave,
      nome: tipo.nome,
      total: pesoNumero * valorBase
    };

  });

  return (

    <div className="container">

      <h1>🧮 Calculadora</h1>

      <h3>Selecione os tipos</h3>

      <div className="grid-tipos-ouro">

        {tipos.map((tipo) => {

          const ativo = tiposSelecionados.includes(tipo.chave);

          return (

            <div
              key={tipo.chave}
              className={`card-tipo-ouro ${ativo ? "ativo" : ""}`}
              onClick={() => alternarTipo(tipo.chave)}
            >

              <div className="icone-card">
                {ativo ? "✓" : "○"}
              </div>

              <strong>{tipo.nome}</strong>

            </div>

          );

        })}

      </div>

      <hr />

      <div className="linha-peso">

  <div>

    <label>Peso / Índice</label>

    <input
      value={peso}
      onChange={(e) => setPeso(e.target.value)}
      placeholder="Ex.: 3,25"
    />

  </div>


  <button
    className="botao-limpar"
    onClick={limparCalculadora}
  >

    🧹 Limpar

  </button>


</div>

      {resultados.length > 0 && pesoNumero > 0 && (

        <>

          <hr />

          <h3>Resultado</h3>

          <div className="grid-resultados-ouro">

            {resultados.map((resultado) => (

              <div
                key={resultado.chave}
                className="card-resultado-ouro"
              >

                <span className="titulo-resultado">
                  {resultado.nome}
                </span>

                <strong className="valor-resultado">
                  R$ {formatarValor(resultado.total)}
                </strong>

              </div>

            ))}

          </div>

        </>

      )}

      <button className="voltar" onClick={voltar}>
        ⬅ Voltar
      </button>

    </div>

  );

}

export default CalculadoraOuroTela;