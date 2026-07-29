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

// ================================
// ALIANÇAS CPL
// CONVERSÃO OURO 416KT
// ================================


export async function buscarConversaoOuro416() {


  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("nome", "conversao_ouro_416")
    .maybeSingle();



  console.log(
    "CONVERSÃO OURO 416:",
    data
  );

  console.log(
    "ERRO CONVERSÃO:",
    error
  );



  if (error || !data) {

    return null;

  }



  return Number(data.valor);


}





export async function salvarConversaoOuro416(valor) {


  const valorNumerico = Number(valor);



  const { data, error } = await supabase
    .from("configuracoes")
    .update({
      valor: valorNumerico
    })
    .eq("nome", "conversao_ouro_416")
    .select()
    .single();



  console.log(
    "CONVERSÃO OURO 416 ATUALIZADA:",
    data
  );


  console.log(
    "ERRO ATUALIZAÇÃO:",
    error
  );



  if (error) {

    console.error(error);

    return null;

  }



  return data;


}

// ================================
// ALIANÇAS CPL
// VALORES DO OURO
// ================================



export async function buscarOuro18CPL() {


  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("nome", "ouro_18_cpl")
    .maybeSingle();



  console.log(
    "OURO 18 CPL:",
    data
  );


  console.log(
    "ERRO OURO 18:",
    error
  );



  if(error || !data){

    return null;

  }



  return Number(data.valor);


}







export async function salvarOuro18CPL(valor) {


  const valorNumerico = Number(valor);



  const { data, error } = await supabase
    .from("configuracoes")
    .update({
      valor: valorNumerico
    })
    .eq("nome", "ouro_18_cpl")
    .select()
    .single();



  console.log(
    "OURO 18 CPL ATUALIZADO:",
    data
  );



  if(error){

    console.error(error);

    return null;

  }



  return data;


}








export async function buscarOuro416CPL() {


  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("nome", "ouro_416_cpl")
    .maybeSingle();



  console.log(
    "OURO 416 CPL:",
    data
  );


  console.log(
    "ERRO OURO 416:",
    error
  );



  if(error || !data){

    return null;

  }



  return Number(data.valor);


}








export async function salvarOuro416CPL(valor) {


  const valorNumerico = Number(valor);



  const { data, error } = await supabase
    .from("configuracoes")
    .update({
      valor: valorNumerico
    })
    .eq("nome", "ouro_416_cpl")
    .select()
    .single();



  console.log(
    "OURO 416 CPL ATUALIZADO:",
    data
  );



  if(error){

    console.error(error);

    return null;

  }



  return data;


}