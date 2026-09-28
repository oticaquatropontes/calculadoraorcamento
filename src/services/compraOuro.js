import { supabase } from "../supabase";


// ==========================================
// BUSCAR ÚLTIMA COTAÇÃO
// ==========================================

export async function buscarUltimaCotacaoOuro() {

  const { data, error } = await supabase
    .from("cotacoes_compra_ouro")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();


  if (error) {

    console.error(
      "Erro buscando última cotação do ouro:",
      error
    );

    return null;

  }


  return data;

}



// ==========================================
// SALVAR NOVA COTAÇÃO
// ==========================================

export async function salvarCotacaoOuro(valor) {

  const { data, error } = await supabase
    .from("cotacoes_compra_ouro")
    .insert({

      valor_cotacao: valor

    })
    .select()
    .single();


  if (error) {

    console.error(
      "ERRO COMPLETO AO SALVAR COTAÇÃO:",
      error
    );

    console.log(
      "CÓDIGO:",
      error?.code
    );

    console.log(
      "MENSAGEM:",
      error?.message
    );

    console.log(
      "DETALHES:",
      error?.details
    );

    console.log(
      "HINT:",
      error?.hint
    );

    return null;

  }


  return data;

}



// ==========================================
// DATA/HORA DE REFERÊNCIA DA COTAÇÃO
// ==========================================
//
// A virada da cotação acontece todos os dias
// às 07:00 no horário local do Paraná.
//
// Antes das 07:00:
// continua valendo a cotação do dia anterior.
//
// A partir das 07:00:
// é necessário ter uma nova cotação.
//
// ==========================================

function obterInicioDoDiaOperacional() {

  const agora = new Date();


  const inicio = new Date(
    agora
  );


  // ========================================
  // Se ainda não chegou às 07:00,
  // o período operacional pertence ao
  // dia anterior.
  // ========================================

  if (
    agora.getHours() < 7
  ) {

    inicio.setDate(
      inicio.getDate() - 1
    );

  }


  inicio.setHours(
    7,
    0,
    0,
    0
  );


  return inicio;

}



// ==========================================
// VERIFICAR SE A COTAÇÃO É DO PERÍODO ATUAL
// ==========================================
//
// Retorna true somente se a cotação foi
// registrada a partir das 07:00 do período
// operacional atual.
//
// ==========================================

export function cotacaoAindaValida(cotacao) {

  if (!cotacao) {

    return false;

  }


  if (!cotacao.criado_em) {

    return false;

  }


  const dataCotacao =
    new Date(
      cotacao.criado_em
    );


  const inicioDiaOperacional =
    obterInicioDoDiaOperacional();


  return (
    dataCotacao >=
    inicioDiaOperacional
  );

}



// ==========================================
// VERIFICAR SE EXISTE COTAÇÃO DO DIA
// ==========================================
//
// Função auxiliar para deixar a regra
// mais clara no componente.
//
// ==========================================

export function cotacaoDoDiaExiste(cotacao) {

  return cotacaoAindaValida(
    cotacao
  );

}



// ==========================================
// BUSCAR HISTÓRICO DA COTAÇÃO
// ==========================================

export async function buscarHistoricoCotacaoOuro(
  dataInicial,
  dataFinal = null
) {

  // ==========================================
  // CONSULTA BASE
  // ==========================================

  let consulta =
    supabase
      .from("cotacoes_compra_ouro")
      .select("*");


  // ==========================================
  // DATA INICIAL
  // ==========================================

  if (dataInicial) {

    consulta =
      consulta.gte(
        "criado_em",
        dataInicial
      );

  }


  // ==========================================
  // DATA FINAL
  // ==========================================

  if (dataFinal) {

    consulta =
      consulta.lte(
        "criado_em",
        dataFinal
      );

  }


  // ==========================================
  // ORDENAR
  // MAIS ANTIGO → MAIS NOVO
  // ==========================================

  const { data, error } =
    await consulta.order(
      "criado_em",
      {
        ascending: true
      }
    );


  // ==========================================
  // TRATAR ERRO
  // ==========================================

  if (error) {

    console.error(
      "Erro buscando histórico da cotação do ouro:",
      error
    );

    console.log(
      "CÓDIGO:",
      error?.code
    );

    console.log(
      "MENSAGEM:",
      error?.message
    );

    console.log(
      "DETALHES:",
      error?.details
    );

    console.log(
      "HINT:",
      error?.hint
    );

    return [];

  }


  // ==========================================
  // RETORNAR DADOS
  // ==========================================

  return data || [];

}