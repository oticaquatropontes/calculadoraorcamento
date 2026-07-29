import { supabase } from "../supabase";


// BUSCAR TODOS OS ÍNDICES

export async function buscarIndicesTamanho() {


  const { data, error } = await supabase
    .from("indices_tamanho_cpl")
    .select("*")
    .order("numero_dedo", {
      ascending: true
    });



  console.log(
    "ÍNDICES TAMANHO:",
    data
  );


  console.log(
    "ERRO ÍNDICES:",
    error
  );



  if(error){

    console.error(error);

    return [];

  }



  return data;


}





// ADICIONAR NOVO ÍNDICE

export async function adicionarIndiceTamanho(
  numeroDedo,
  indice
) {


  const { data, error } = await supabase
    .from("indices_tamanho_cpl")
    .insert([
      {
        numero_dedo: Number(numeroDedo),
        indice: Number(indice)
      }
    ])
    .select()
    .single();



  console.log(
    "ÍNDICE ADICIONADO:",
    data
  );


  console.log(
    "ERRO ADICIONAR:",
    error
  );



  if(error){

    console.error(error);

    return null;

  }



  return data;


}





// EDITAR ÍNDICE

export async function editarIndiceTamanho(
  id,
  numeroDedo,
  indice
) {


  const { data, error } = await supabase
    .from("indices_tamanho_cpl")
    .update({

      numero_dedo: Number(numeroDedo),
      indice: Number(indice)

    })
    .eq("id", id)
    .select()
    .single();



  console.log(
    "ÍNDICE EDITADO:",
    data
  );


  console.log(
    "ERRO EDITAR:",
    error
  );



  if(error){

    console.error(error);

    return null;

  }



  return data;


}





// EXCLUIR ÍNDICE

export async function excluirIndiceTamanho(id) {


  const { error } = await supabase
    .from("indices_tamanho_cpl")
    .delete()
    .eq("id", id);



  console.log(
    "ERRO EXCLUIR:",
    error
  );



  if(error){

    console.error(error);

    return false;

  }



  return true;


}

// BUSCAR ÍNDICE POR NUMERAÇÃO DO DEDO

export async function buscarIndicePorDedo(numeroDedo) {


  if(!numeroDedo){

    return null;

  }



  const { data, error } = await supabase

    .from("indices_tamanho_cpl")

    .select("indice")

    .eq(
      "numero_dedo",
      Number(numeroDedo)
    )

    .single();




  if(error){

    console.error(
      "Erro buscando índice do dedo:",
      error
    );

    return null;

  }




  return Number(data.indice);


}