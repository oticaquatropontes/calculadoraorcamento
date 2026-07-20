import { supabase } from "../supabase";


console.log("ARQUIVO CONFIGURACOES CARREGADO");


// BUSCAR ÍNDICE ATUAL
export async function buscarIndiceGeral() {

  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("nome", "indice_geral")
    .maybeSingle();


  console.log("DADOS COMPLETOS:", data);
  console.log("VALOR RECEBIDO:", data?.valor);
  console.log("TIPO DO VALOR:", typeof data?.valor);
  console.log("ERRO:", error);


  if (error || !data) {

    return 0;

  }


  return Number(data.valor);

}



// SALVAR NOVO ÍNDICE
export async function salvarIndiceGeral(valor) {


  const { data: existente, error: erroBusca } = await supabase
    .from("configuracoes")
    .select("id")
    .eq("nome", "indice_geral")
    .maybeSingle();



  if (erroBusca) {

    console.error("Erro buscando configuração:", erroBusca);
    return null;

  }



  if (existente) {


    const { error } = await supabase
      .from("configuracoes")
      .update({
        valor: Number(valor)
      })
      .eq("id", existente.id);



    if (error) {

      console.error("Erro atualizando índice:", error);
      return null;

    }



    return {
      id: existente.id,
      valor: Number(valor)
    };


  } else {


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

      console.error("Erro criando índice:", error);
      return null;

    }



    return data;

  }

}