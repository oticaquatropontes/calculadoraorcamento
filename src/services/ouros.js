import { supabase } from "../supabase";


// Buscar todos os valores configurados
export async function buscarValoresOuro() {

  const { data, error } = await supabase
    .from("config_ouro")
    .select("*");


  if (error) {

    console.error(
      "Erro ao buscar valores ouro:",
      error
    );

    return [];

  }


  return data;

}





// Salvar ou atualizar valores
export async function salvarValorOuro(chave, valor) {

  console.log("SALVANDO:", chave, valor);


  const { error } = await supabase
    .from("config_ouro")
    .upsert(
      {
        chave: chave,
        valor: Number(valor)
      },
      {
        onConflict: "chave"
      }
    );


  console.log("ERRO BANCO:", error);


  if (error) {

    return false;

  }


  return true;

}