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