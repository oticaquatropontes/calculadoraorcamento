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

  const { error } = await supabase
    .from("configuracoes")
    .update({
      valor: Number(valor)
    })
    .eq("id", 1);


  console.log("ERRO UPDATE:", error);


  if(error){
    console.error(error);
    return null;
  }


  return {
    id:1,
    valor:Number(valor)
  };

}