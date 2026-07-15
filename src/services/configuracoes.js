import { supabase } from "../supabase";


console.log("ARQUIVO CONFIGURACOES CARREGADO");


export async function buscarIndiceGeral() {

  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .single();


  console.log("DADOS COMPLETOS:", data);
  console.log("VALOR RECEBIDO:", data?.valor);
  console.log("TIPO DO VALOR:", typeof data?.valor);
  console.log("ERRO:", error);


  if (error) {
    return 0;
  }


  return Number(data.valor);

}