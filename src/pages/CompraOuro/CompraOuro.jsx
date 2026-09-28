import { useEffect, useState } from "react";

import {
  buscarUltimaCotacaoOuro,
  salvarCotacaoOuro,
  buscarHistoricoCotacaoOuro
} from "../../services/compraOuro";

import "./CompraOuro.css";


function CompraOuro({ voltar }) {


  // ==========================================
  // ESTADOS
  // ==========================================

  const [cotacao, setCotacao] = useState("");

  const [cotacaoAtiva, setCotacaoAtiva] =
    useState(null);

  const [ultimaCotacaoEncontrada, setUltimaCotacaoEncontrada] =
    useState(null);

  const [mostrarCotacao, setMostrarCotacao] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  // IMPORTANTE:
  // Indica que o usuário escolheu usar a cotação anterior.
  //
  // Esse estado NÃO é salvo no localStorage.
  // Portanto, ao sair da tela e entrar novamente,
  // ele será perdido e a cotação será solicitada novamente.

  const [usandoCotacaoAnterior, setUsandoCotacaoAnterior] =
    useState(false);


  const [gramas416, setGramas416] =
    useState("");

  const [gramas18, setGramas18] =
    useState("");


  // ==========================================
  // HISTÓRICO
  // ==========================================

  const [mostrarHistorico, setMostrarHistorico] =
    useState(false);

  const [periodoHistorico, setPeriodoHistorico] =
    useState(null);

  const [filtroHistorico, setFiltroHistorico] =
    useState(null);

  const [dadosHistorico, setDadosHistorico] =
    useState([]);

  const [carregandoHistorico, setCarregandoHistorico] =
    useState(false);


  // ==========================================
  // VERIFICAR COTAÇÃO AO ABRIR
  // ==========================================

  useEffect(() => {

    verificarCotacao();

  }, []);


  // ==========================================
  // CALCULAR INÍCIO DO PERÍODO ATUAL
  //
  // A cotação vale:
  //
  // 07:00 de hoje
  // até
  // 06:59:59 de amanhã
  //
  // Se agora ainda for antes das 07:00,
  // o período começou ontem às 07:00.
  // ==========================================

  function obterInicioPeriodoCotacao() {

    const agora = new Date();

    const inicio = new Date(agora);

    inicio.setHours(
      7,
      0,
      0,
      0
    );


    // Se ainda não chegou às 07:00,
    // estamos no período iniciado ontem.

    if (
      agora.getHours() < 7
    ) {

      inicio.setDate(
        inicio.getDate() - 1
      );

    }


    return inicio;

  }


  // ==========================================
  // VERIFICAR SE EXISTE COTAÇÃO DO PERÍODO
  // ==========================================

  function cotacaoDoPeriodoAtual(cotacaoEncontrada) {

    if (!cotacaoEncontrada) {

      return false;

    }


    if (!cotacaoEncontrada.criado_em) {

      return false;

    }


    const dataCotacao =
      new Date(
        cotacaoEncontrada.criado_em
      );


    const inicioPeriodo =
      obterInicioPeriodoCotacao();


    return (
      dataCotacao >= inicioPeriodo
    );

  }


  // ==========================================
  // VERIFICAR COTAÇÃO AO ABRIR
  // ==========================================

  async function verificarCotacao() {

    setCarregando(true);


    // Sempre começamos uma nova sessão
    // sem autorização para usar cotação anterior.

    setUsandoCotacaoAnterior(false);


    const ultimaCotacao =
      await buscarUltimaCotacaoOuro();


    setUltimaCotacaoEncontrada(
      ultimaCotacao
    );


    // ==========================================
    // EXISTE COTAÇÃO VÁLIDA DO PERÍODO?
    // ==========================================

    if (
      cotacaoDoPeriodoAtual(
        ultimaCotacao
      )
    ) {

      setCotacaoAtiva(
        Number(
          ultimaCotacao.valor_cotacao
        )
      );

      setMostrarCotacao(false);

    }

    // ==========================================
    // NÃO EXISTE COTAÇÃO DO PERÍODO
    // ==========================================

    else {

      setCotacaoAtiva(null);

      setMostrarCotacao(true);

    }


    setCarregando(false);

  }


  // ==========================================
  // INICIAR COM NOVA COTAÇÃO
  // ==========================================

  async function iniciarCotacao() {

    const valor =
      Number(
        String(cotacao)
          .replace(",", ".")
      );


    if (
      !valor ||
      valor <= 0
    ) {

      alert(
        "Informe uma cotação válida."
      );

      return;

    }


    const novaCotacao =
      await salvarCotacaoOuro(
        valor
      );


    if (!novaCotacao) {

      alert(
        "Não foi possível salvar a cotação."
      );

      return;

    }


    // ==========================================
    // NOVA COTAÇÃO REGISTRADA
    // ==========================================

    setCotacaoAtiva(
      valor
    );


    setUltimaCotacaoEncontrada(
      novaCotacao
    );


    setUsandoCotacaoAnterior(
      false
    );


    setMostrarCotacao(
      false
    );

  }


  // ==========================================
  // USAR COTAÇÃO ANTERIOR
  //
  // IMPORTANTE:
  // Não salva nada no banco.
  // Não usa localStorage.
  // Funciona somente enquanto esta tela
  // estiver aberta.
  // ==========================================

  function usarCotacaoAnterior() {

    if (
      !ultimaCotacaoEncontrada
    ) {

      alert(
        "Não existe uma cotação anterior disponível."
      );

      return;

    }


    const valorAnterior =
      Number(
        ultimaCotacaoEncontrada.valor_cotacao
      );


    if (
      !valorAnterior ||
      valorAnterior <= 0
    ) {

      alert(
        "A última cotação encontrada é inválida."
      );

      return;

    }


    setCotacaoAtiva(
      valorAnterior
    );


    setUsandoCotacaoAnterior(
      true
    );


    setMostrarCotacao(
      false
    );

  }


  // ==========================================
  // CALCULAR DATA INICIAL
  // ==========================================

  function calcularDataInicial(dias) {

    if (dias === "todos") {

      return null;

    }


    const agora = new Date();

    const dataInicial =
      new Date(agora);


    dataInicial.setDate(
      agora.getDate() - Number(dias)
    );


    dataInicial.setHours(
      0,
      0,
      0,
      0
    );


    return dataInicial;

  }


  // ==========================================
  // PEGAR SEGUNDA-FEIRA DA SEMANA
  // ==========================================

  function obterInicioSemana(dataOriginal) {

    const data =
      new Date(
        dataOriginal
      );


    const dia =
      data.getDay();


    const diferenca =
      dia === 0
        ? 6
        : dia - 1;


    data.setDate(
      data.getDate() - diferenca
    );


    data.setHours(
      0,
      0,
      0,
      0
    );


    return data;

  }


  // ==========================================
  // CRIAR CHAVE DO GRUPO
  // ==========================================

  function criarChaveGrupo(
    data,
    periodo
  ) {

    // ========================================
    // DIÁRIO
    // ========================================

    if (
      periodo === "diario"
    ) {

      return (
        `${data.getFullYear()}-` +
        `${String(
          data.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
          data.getDate()
        ).padStart(2, "0")}`
      );

    }


    // ========================================
    // SEMANAL
    // ========================================

    if (
      periodo === "semanal"
    ) {

      const inicioSemana =
        obterInicioSemana(
          data
        );


      return (
        `${inicioSemana.getFullYear()}-` +
        `${String(
          inicioSemana.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
          inicioSemana.getDate()
        ).padStart(2, "0")}`
      );

    }


    // ========================================
    // MENSAL
    // ========================================

    if (
      periodo === "mensal"
    ) {

      return (
        `${data.getFullYear()}-` +
        `${String(
          data.getMonth() + 1
        ).padStart(2, "0")}`
      );

    }


    // ========================================
    // ANUAL
    // ========================================

    if (
      periodo === "anual"
    ) {

      return String(
        data.getFullYear()
      );

    }


    return data.toISOString();

  }


  // ==========================================
  // AGRUPAR HISTÓRICO
  // ==========================================

  function agruparHistorico(
    dados,
    periodo
  ) {

    if (
      !dados ||
      !dados.length
    ) {

      return [];

    }


    const dadosOrdenados =
      [...dados].sort(
        (a, b) =>
          new Date(a.criado_em) -
          new Date(b.criado_em)
      );


    const grupos =
      new Map();


    dadosOrdenados.forEach(
      (item) => {

        const data =
          new Date(
            item.criado_em
          );


        const chave =
          criarChaveGrupo(
            data,
            periodo
          );


        let dataReferencia =
          data;


        if (
          periodo === "semanal"
        ) {

          dataReferencia =
            obterInicioSemana(
              data
            );

        }


        if (
          periodo === "mensal"
        ) {

          dataReferencia =
            new Date(
              data.getFullYear(),
              data.getMonth(),
              1
            );

        }


        if (
          periodo === "anual"
        ) {

          dataReferencia =
            new Date(
              data.getFullYear(),
              0,
              1
            );

        }


        grupos.set(
          chave,
          {
            ...item,
            data_referencia:
              dataReferencia.toISOString()
          }
        );

      }
    );


    return Array.from(
      grupos.values()
    ).sort(
      (a, b) =>
        new Date(
          a.data_referencia
        ) -
        new Date(
          b.data_referencia
        )
    );

  }


  // ==========================================
  // ABRIR HISTÓRICO
  // ==========================================

  async function abrirHistorico(
    periodo,
    filtro
  ) {

    setPeriodoHistorico(
      periodo
    );


    setFiltroHistorico(
      filtro
    );


    setCarregandoHistorico(
      true
    );


    setDadosHistorico([]);


    const dataInicial =
      calcularDataInicial(
        filtro
      );


    const dados =
      await buscarHistoricoCotacaoOuro(
        dataInicial
          ? dataInicial.toISOString()
          : null
      );


    const dadosAgrupados =
      agruparHistorico(
        dados,
        periodo
      );


    setDadosHistorico(
      dadosAgrupados
    );


    setCarregandoHistorico(
      false
    );

  }


  // ==========================================
  // FECHAR HISTÓRICO
  // ==========================================

  function fecharHistorico() {

    setMostrarHistorico(
      false
    );


    setPeriodoHistorico(
      null
    );


    setFiltroHistorico(
      null
    );


    setDadosHistorico(
      []
    );

  }


  // ==========================================
  // VOLTAR PARA ESCOLHA DO PERÍODO
  // ==========================================

  function voltarParaPeriodos() {

    setPeriodoHistorico(
      null
    );


    setFiltroHistorico(
      null
    );


    setDadosHistorico(
      []
    );

  }


  // ==========================================
  // CÁLCULO OURO 416KT
  // ==========================================

  function calcularOuro416() {

    if (
      !cotacaoAtiva ||
      !gramas416
    ) {

      return 0;

    }


    const gramas =
      Number(
        String(gramas416)
          .replace(",", ".")
      );


    if (!gramas) {

      return 0;

    }


    const valorBase =
      cotacaoAtiva *
      416;


    const valorComDesconto =
      valorBase *
      0.90;


    const valorPorGrama =
      valorComDesconto /
      1000;


    return (
      valorPorGrama *
      gramas
    );

  }


  // ==========================================
  // CÁLCULO OURO 18KT
  // ==========================================

  function calcularOuro18() {

    if (
      !cotacaoAtiva ||
      !gramas18
    ) {

      return 0;

    }


    const gramas =
      Number(
        String(gramas18)
          .replace(",", ".")
      );


    if (!gramas) {

      return 0;

    }


    const valorBase =
      cotacaoAtiva *
      750;


    const valorComDesconto =
      valorBase *
      0.90;


    const valorPorGrama =
      valorComDesconto /
      1000;


    return (
      valorPorGrama *
      gramas
    );

  }


  // ==========================================
  // FORMATAR VALOR
  // ==========================================

  function formatarValor(
    valor
  ) {

    return Number(
      valor || 0
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

  }


  // ==========================================
  // FORMATAR DATA
  // ==========================================

  function formatarDataHistorico(
    data
  ) {

    const dataObj =
      new Date(data);


    // ========================================
    // DIÁRIO
    // ========================================

    if (
      periodoHistorico === "diario"
    ) {

      return dataObj.toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit"
        }
      );

    }


    // ========================================
    // SEMANAL
    // ========================================

    if (
      periodoHistorico === "semanal"
    ) {

      return dataObj.toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit"
        }
      );

    }


    // ========================================
    // MENSAL
    // ========================================

    if (
      periodoHistorico === "mensal"
    ) {

      return dataObj.toLocaleDateString(
        "pt-BR",
        {
          month: "short",
          year: "numeric"
        }
      );

    }


    // ========================================
    // ANUAL
    // ========================================

    if (
      periodoHistorico === "anual"
    ) {

      return dataObj.toLocaleDateString(
        "pt-BR",
        {
          year: "numeric"
        }
      );

    }


    return dataObj.toLocaleDateString(
      "pt-BR"
    );

  }


  // ==========================================
  // TÍTULO DO HISTÓRICO
  // ==========================================

  function tituloHistorico() {

    if (
      periodoHistorico === "diario"
    ) {

      return "Histórico Diário";

    }


    if (
      periodoHistorico === "semanal"
    ) {

      return "Histórico Semanal";

    }


    if (
      periodoHistorico === "mensal"
    ) {

      return "Histórico Mensal";

    }


    if (
      periodoHistorico === "anual"
    ) {

      return "Histórico Anual";

    }


    return "Histórico da Cotação";

  }


  // ==========================================
  // TEXTO DO FILTRO
  // ==========================================

  function textoFiltroHistorico() {

    if (
      filtroHistorico === "todos"
    ) {

      return "Todo o período";

    }


    if (!filtroHistorico) {

      return "";

    }


    return `Últimos ${filtroHistorico} dias`;

  }


  // ==========================================
  // GRÁFICO
  // ==========================================

  function GraficoHistorico() {

    const largura = 760;

    const altura = 340;

    const margemEsquerda = 60;

    const margemDireita = 70;

    const margemSuperior = 45;

    const margemInferior = 65;


    const areaLargura =
      largura -
      margemEsquerda -
      margemDireita;


    const areaAltura =
      altura -
      margemSuperior -
      margemInferior;


    // ==========================================
    // SEM DADOS
    // ==========================================

    if (
      !dadosHistorico.length
    ) {

      const centroX =
        margemEsquerda +
        areaLargura / 2;


      const centroY =
        margemSuperior +
        areaAltura / 2;


      return (

        <div
          className="grafico-historico"
          style={{
            background: "#ffffff"
          }}
        >

          <svg
            viewBox={`0 0 ${largura} ${altura}`}
            width="100%"
            height="340"
            preserveAspectRatio="none"
          >

            <line
              x1={margemEsquerda}
              y1={margemSuperior}
              x2={
                margemEsquerda +
                areaLargura
              }
              y2={margemSuperior}
              stroke="#e5e7eb"
              strokeWidth="1"
            />


            <line
              x1={margemEsquerda}
              y1={centroY}
              x2={
                margemEsquerda +
                areaLargura
              }
              y2={centroY}
              stroke="#e5e7eb"
              strokeWidth="1"
            />


            <line
              x1={margemEsquerda}
              y1={
                margemSuperior +
                areaAltura
              }
              x2={
                margemEsquerda +
                areaLargura
              }
              y2={
                margemSuperior +
                areaAltura
              }
              stroke="#e5e7eb"
              strokeWidth="1"
            />


            <circle
              cx={centroX}
              cy={centroY}
              r="5"
              fill="#c89b3c"
            />

          </svg>


          <div
            className="grafico-ultima-cotacao"
            style={{
              background: "#ffffff",
              textAlign: "center",
              marginTop: "5px"
            }}
          >

            Nenhuma cotação encontrada.

          </div>

        </div>

      );

    }


    // ==========================================
    // VALORES
    // ==========================================

    const valores =
      dadosHistorico.map(
        item =>
          Number(
            item.valor_cotacao
          )
      );


    const maiorValor =
      Math.max(...valores);


    const menorValor =
      Math.min(...valores);


    let diferenca =
      maiorValor -
      menorValor;


    if (
      diferenca === 0
    ) {

      diferenca =
        maiorValor *
          0.10 ||
        1;

    }


    const valorMinimo =
      menorValor -
      diferenca *
        0.20;


    const valorMaximo =
      maiorValor +
      diferenca *
        0.20;


    // ==========================================
    // POSIÇÃO X
    // ==========================================

    function calcularX(index) {

      if (
        dadosHistorico.length === 1
      ) {

        return (
          margemEsquerda +
          areaLargura / 2
        );

      }


      return (
        margemEsquerda +
        (
          index /
          (
            dadosHistorico.length -
            1
          )
        ) *
        areaLargura
      );

    }


    // ==========================================
    // POSIÇÃO Y
    // ==========================================

    function calcularY(valor) {

      return (
        margemSuperior +
        (
          1 -
          (
            (
              valor -
              valorMinimo
            ) /
            (
              valorMaximo -
              valorMinimo
            )
          )
        ) *
        areaAltura
      );

    }


    // ==========================================
    // CRIAR PONTOS
    // ==========================================

    const pontos =
      dadosHistorico.map(
        (
          item,
          index
        ) => {

          const valor =
            Number(
              item.valor_cotacao
            );


          return {

            x:
              calcularX(index),

            y:
              calcularY(valor),

            valor,

            data:
              item.data_referencia ||
              item.criado_em

          };

        }
      );


    // ==========================================
    // LINHA
    // ==========================================

    const linha =
      pontos
        .map(
          (
            ponto,
            index
          ) =>
            `${
              index === 0
                ? "M"
                : "L"
            } ${
              ponto.x
            } ${
              ponto.y
            }`
        )
        .join(" ");


    // ==========================================
    // QUANTIDADE DE DATAS
    // ==========================================

    function deveMostrarData(index) {

      if (
        dadosHistorico.length <= 6
      ) {

        return true;

      }


      return (
        index === 0 ||
        index ===
          Math.floor(
            dadosHistorico.length /
            2
          ) ||
        index ===
          dadosHistorico.length -
          1
      );

    }


    // ==========================================
    // GRÁFICO
    // ==========================================

    return (

      <div
        className="grafico-historico"
        style={{
          background: "#ffffff"
        }}
      >

        <svg
          viewBox={`0 0 ${largura} ${altura}`}
          width="100%"
          height="340"
          preserveAspectRatio="none"
        >

          <line
            x1={margemEsquerda}
            y1={margemSuperior}
            x2={
              margemEsquerda +
              areaLargura
            }
            y2={margemSuperior}
            stroke="#e5e7eb"
            strokeWidth="1"
          />


          <line
            x1={margemEsquerda}
            y1={
              margemSuperior +
              areaAltura / 2
            }
            x2={
              margemEsquerda +
              areaLargura
            }
            y2={
              margemSuperior +
              areaAltura / 2
            }
            stroke="#e5e7eb"
            strokeWidth="1"
          />


          <line
            x1={margemEsquerda}
            y1={
              margemSuperior +
              areaAltura
            }
            x2={
              margemEsquerda +
              areaLargura
            }
            y2={
              margemSuperior +
              areaAltura
            }
            stroke="#e5e7eb"
            strokeWidth="1"
          />


          <path
            d={linha}
            fill="none"
            stroke="#c89b3c"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />


          {pontos.map(
            (
              ponto,
              index
            ) => (

              <g
                key={index}
              >

                <circle
                  cx={ponto.x}
                  cy={ponto.y}
                  r="6"
                  fill="#c89b3c"
                />


                <text
                  x={ponto.x}
                  y={
                    ponto.y -
                    14
                  }
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="#111827"
                >

                  {formatarValor(
                    ponto.valor
                  )}

                </text>


                {deveMostrarData(index) && (

                  <text
                    x={ponto.x}
                    y={
                      margemSuperior +
                      areaAltura +
                      28
                    }
                    textAnchor="middle"
                    fontSize="12"
                    fill="#4b5563"
                  >

                    {formatarDataHistorico(
                      ponto.data
                    )}

                  </text>

                )}

              </g>

            )
          )}

        </svg>


        <div
          className="grafico-ultima-cotacao"
          style={{
            background: "#ffffff",
            textAlign: "center",
            marginTop: "5px"
          }}
        >

          <span>
            Última cotação registrada
          </span>


          <strong
            style={{
              marginLeft: "5px"
            }}
          >

            {formatarValor(
              dadosHistorico[
                dadosHistorico.length -
                1
              ].valor_cotacao
            )}

          </strong>

        </div>


      </div>

    );

  }


  // ==========================================
  // CARREGANDO
  // ==========================================

  if (carregando) {

    return (

      <div
        className="compra-ouro"
        style={{
          background: "#ffffff"
        }}
      >

        <div className="compra-ouro-carregando">

          Carregando...

        </div>

      </div>

    );

  }


  // ==========================================
  // TELA PRINCIPAL
  // ==========================================

  return (

    <div
      className="compra-ouro"
      style={{
        background: "#ffffff"
      }}
    >


      {/* ==========================================
          CABEÇALHO
      ========================================== */}

      <div className="compra-ouro-cabecalho">

        <h1>
          🟡 Compra de Ouro
        </h1>


        <p>
          Cotação atual e cálculo por gramas
        </p>

      </div>


      {/* ==========================================
          MODAL DA COTAÇÃO
      ========================================== */}

      {mostrarCotacao && (

        <div className="modal-overlay">

          <div className="modal-cotacao">

            <h2>
              Cotação do dia
            </h2>


            <p>
              Informe a cotação do ouro para
              iniciar os cálculos.
            </p>


            <label>
              Cotação do dia
            </label>


            <div className="campo-cotacao">

              <span>
                R$
              </span>


              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={cotacao}
                onChange={(e) =>
                  setCotacao(
                    e.target.value
                  )
                }
              />

            </div>


            <button
              className="botao-iniciar"
              onClick={iniciarCotacao}
            >
              Iniciar
            </button>


            {/* ======================================
                USAR COTAÇÃO ANTERIOR
            ====================================== */}

            {ultimaCotacaoEncontrada && (

              <button
                className="botao-usar-anterior"
                onClick={
                  usarCotacaoAnterior
                }
              >

                Usar cotação anterior

              </button>

            )}

          </div>

        </div>

      )}


      {/* ==========================================
          MODAL DE ESCOLHA DO TIPO
      ========================================== */}

      {mostrarHistorico &&
        !periodoHistorico && (

        <div className="modal-overlay">

          <div className="modal-historico">

            <h2>
              📊 Histórico da Cotação
            </h2>


            <p>
              Selecione como deseja visualizar:
            </p>


            <button
              onClick={() =>
                setPeriodoHistorico(
                  "diario"
                )
              }
            >
              📅 Diário
            </button>


            <button
              onClick={() =>
                setPeriodoHistorico(
                  "semanal"
                )
              }
            >
              📆 Semanal
            </button>


            <button
              onClick={() =>
                setPeriodoHistorico(
                  "mensal"
                )
              }
            >
              🗓️ Mensal
            </button>


            <button
              onClick={() =>
                setPeriodoHistorico(
                  "anual"
                )
              }
            >
              📈 Anual
            </button>


            <button
              onClick={
                fecharHistorico
              }
            >
              ❌ Fechar
            </button>

          </div>

        </div>

      )}


      {/* ==========================================
          MODAL DO FILTRO
      ========================================== */}

      {mostrarHistorico &&
        periodoHistorico &&
        !filtroHistorico && (

        <div className="modal-overlay">

          <div className="modal-historico">

            <h2>
              📊 {tituloHistorico()}
            </h2>


            <p>
              Escolha o período que deseja analisar:
            </p>


            <button
              onClick={() =>
                abrirHistorico(
                  periodoHistorico,
                  7
                )
              }
            >
              Últimos 7 dias
            </button>


            <button
              onClick={() =>
                abrirHistorico(
                  periodoHistorico,
                  30
                )
              }
            >
              Últimos 30 dias
            </button>


            <button
              onClick={() =>
                abrirHistorico(
                  periodoHistorico,
                  60
                )
              }
            >
              Últimos 60 dias
            </button>


            <button
              onClick={() =>
                abrirHistorico(
                  periodoHistorico,
                  90
                )
              }
            >
              Últimos 90 dias
            </button>


            <button
              onClick={() =>
                abrirHistorico(
                  periodoHistorico,
                  180
                )
              }
            >
              Últimos 180 dias
            </button>


            <button
              onClick={() =>
                abrirHistorico(
                  periodoHistorico,
                  365
                )
              }
            >
              Últimos 365 dias
            </button>


            <button
              onClick={() =>
                abrirHistorico(
                  periodoHistorico,
                  "todos"
                )
              }
            >
              📚 Todo o período
            </button>


            <button
              onClick={
                voltarParaPeriodos
              }
            >
              ← Voltar
            </button>


            <button
              onClick={
                fecharHistorico
              }
            >
              ❌ Fechar
            </button>

          </div>

        </div>

      )}


      {/* ==========================================
          MODAL DO GRÁFICO
      ========================================== */}

      {mostrarHistorico &&
        periodoHistorico &&
        filtroHistorico && (

        <div className="modal-overlay">

          <div
            className="modal-grafico"
            style={{
              background: "#ffffff"
            }}
          >

            <h2>
              📊 {tituloHistorico()}
            </h2>


            <p
              style={{
                textAlign: "center",
                marginTop: "-10px",
                marginBottom: "15px",
                color: "#6b7280"
              }}
            >

              {textoFiltroHistorico()}

            </p>


            {carregandoHistorico ? (

              <div className="historico-carregando">

                Carregando histórico...

              </div>

            ) : (

              <GraficoHistorico />

            )}


            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "15px"
              }}
            >

              <button
                className="botao-fechar-historico"
                onClick={
                  voltarParaPeriodos
                }
              >
                ← Alterar período
              </button>


              <button
                className="botao-fechar-historico"
                onClick={
                  fecharHistorico
                }
              >
                Fechar
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==========================================
          CONTEÚDO PRINCIPAL
      ========================================== */}

      {!mostrarCotacao &&
        cotacaoAtiva && (

        <div className="conteudo-compra-ouro">


          {/* ======================================
              COTAÇÃO ATUAL
          ====================================== */}

          <div className="cotacao-atual">

            <span>

              {usandoCotacaoAnterior
                ? "Cotação anterior utilizada"
                : "Cotação utilizada"}

            </span>


            <strong>

              {formatarValor(
                cotacaoAtiva
              )}

            </strong>

          </div>


          {/* ======================================
              AVISO DE COTAÇÃO ANTERIOR
          ====================================== */}

          {usandoCotacaoAnterior && (

            <div
              style={{
                marginBottom: "17px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fff8e7",
                border: "1px solid #f0d58a",
                color: "#7a5b00",
                textAlign: "center",
                fontSize: "13px",
                lineHeight: "1.4"
              }}
            >

              Você está utilizando a última cotação
              registrada. Ao sair desta tela,
              será necessário informar novamente
              a cotação.

            </div>

          )}


          {/* ======================================
              OURO 416 KT
          ====================================== */}

          <div className="card-ouro">

            <h2>
              Ouro 416KT
            </h2>


            <label>
              Gramas
            </label>


            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={gramas416}
              onChange={(e) =>
                setGramas416(
                  e.target.value
                )
              }
            />


            <div className="resultado-ouro">

              <span>
                Resultado:
              </span>


              <strong>

                {formatarValor(
                  calcularOuro416()
                )}

              </strong>

            </div>

          </div>


          {/* ======================================
              OURO 18 KT
          ====================================== */}

          <div className="card-ouro">

            <h2>
              Ouro 18KT
            </h2>


            <label>
              Gramas
            </label>


            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={gramas18}
              onChange={(e) =>
                setGramas18(
                  e.target.value
                )
              }
            />


            <div className="resultado-ouro">

              <span>
                Resultado:
              </span>


              <strong>

                {formatarValor(
                  calcularOuro18()
                )}

              </strong>

            </div>

          </div>


          {/* ======================================
              BOTÕES
          ====================================== */}

          <div className="acoes-compra-ouro">

            <button
              className="botao-historico"
              onClick={() => {

                setMostrarHistorico(
                  true
                );

                setPeriodoHistorico(
                  null
                );

                setFiltroHistorico(
                  null
                );

                setDadosHistorico(
                  []
                );

              }}
            >

              📊 Histórico

            </button>


            <button
              className="botao-voltar"
              onClick={voltar}
            >

              ← Voltar

            </button>

          </div>


        </div>

      )}

    </div>

  );

}


export default CompraOuro;