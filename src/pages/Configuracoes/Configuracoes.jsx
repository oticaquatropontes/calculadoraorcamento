import { supabase } from "../supabase";


// BUSCAR ÍNDICE ATUAL
export async function buscarIndiceGeral() {

  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("nome", "indice_geral")
    .maybeSingle();


  console.log("CONFIGURAÇÃO BUSCADA:", data);
  console.log("ERRO BUSCA:", error);


  if (error || !data) {

    return 0;

  }


  return Number(data.valor);

}



// SALVAR NOVO ÍNDICE
export async function salvarIndiceGeral(valor) {

  console.log("VALOR QUE VAI PARA O SUPABASE:", valor);


  const { data: existente, error: erroBusca } = await supabase
    .from("configuracoes")
    .select("id")
    .eq("nome", "indice_geral")
    .maybeSingle();



  if (erroBusca) {

    console.error(
      "Erro buscando configuração:",
      erroBusca
    );

    return null;

  }



  if (!existente) {

    console.log(
      "Configuração não encontrada, criando..."
    );


    const { data, error } = await supabase
      .from("configuracoes")
      .insert([
        {
          nome: "indice_geral",
          valor: Number(valor)
        }
      ])
      .select()
      .single();



    if (error) {

      console.error(
        "Erro criando índice:",
        error
      );

      return null;

    }


    return data;

  }



  const { data, error } = await supabase
    .from("configuracoes")
    .update({
      valor: Number(valor)
    })
    .eq("id", existente.id)
    .select()
    .single();



  if (error) {

    console.error(
      "Erro atualizando índice:",
      error
    );

    return null;

  }



  console.log(
    "ÍNDICE ATUALIZADO:",
    data
  );


  return data;

}