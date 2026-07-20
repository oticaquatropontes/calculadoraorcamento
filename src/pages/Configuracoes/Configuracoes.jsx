import { supabase } from "../supabase";


export async function buscarIndiceGeral() {

  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("nome", "indice_geral")
    .single();


  if (error) {

    console.log("Erro buscando índice:", error);

    return 0;

  }


  return Number(data.valor);

}

export async function salvarIndiceGeral(valor) {

  const { data, error } = await supabase
    .from("configuracoes")
    .update({
      valor: Number(valor)
    })
    .eq("nome", "indice_geral")
    .select()
    .single();


  if (error) {

    console.log("Erro salvando índice:", error);
    return null;

  }


  return data;

}