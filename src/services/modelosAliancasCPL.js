import { supabase } from "../supabase";




// BUSCAR MODELOS
export async function buscarModelosCPL() {


  const { data, error } =
    await supabase
      .from("modelos_aliancas_cpl")
      .select("*")
      .order("nome_modelo");



  if(error){

    console.error(
      "Erro buscando modelos:",
      error
    );

    return [];

  }



  return data || [];

}









// UPLOAD FOTO MODELO CPL
export async function uploadFotoModeloCPL(arquivo) {


  if (!arquivo) {

    return null;

  }



  const extensao =
    arquivo.name
      .split(".")
      .pop();



  const nomeArquivo =
    `${Date.now()}.${extensao}`;



  const caminho =
    `modelos-cpl/${nomeArquivo}`;





  const { error } =
    await supabase
      .storage
      .from("modelos-cpl")
      .upload(
        caminho,
        arquivo
      );





  if(error){

    console.error(
      "Erro upload foto:",
      error
    );

    return null;

  }






  const { data } =
    supabase
      .storage
      .from("modelos-cpl")
      .getPublicUrl(caminho);





  return data.publicUrl;

}











// ADICIONAR MODELO
// ADICIONAR MODELO
export async function adicionarModeloCPL(dados) {


  // verifica se já existe modelo com mesmo nome
  const { data: existente, error: erroBusca } =
    await supabase
      .from("modelos_aliancas_cpl")
      .select("id")
      .ilike(
        "nome_modelo",
        dados.nome_modelo.trim()
      )
      .maybeSingle();



  if(erroBusca){

    console.error(
      "Erro verificando modelo existente:",
      erroBusca
    );

    return null;

  }




  if(existente){

    alert(
      "Já existe um modelo cadastrado com esse nome."
    );

    return null;

  }






  const { data, error } =
    await supabase
      .from("modelos_aliancas_cpl")
      .insert([
        dados
      ])
      .select()
      .single();





  if(error){

    console.error(
      "Erro adicionando modelo:",
      error
    );

    return null;

  }





  return data;

}











// EDITAR MODELO
// EDITAR MODELO
export async function editarModeloCPL(id, dados) {


  // verifica se existe outro modelo com mesmo nome
  const { data: existente, error: erroBusca } =
    await supabase
      .from("modelos_aliancas_cpl")
      .select("id")
      .ilike(
        "nome_modelo",
        dados.nome_modelo.trim()
      )
      .neq(
        "id",
        id
      )
      .maybeSingle();




  if(erroBusca){

    console.error(
      "Erro verificando duplicidade:",
      erroBusca
    );

    return null;

  }





  if(existente){

    alert(
      "Já existe outro modelo cadastrado com esse nome."
    );

    return null;

  }






  const { data, error } =
    await supabase
      .from("modelos_aliancas_cpl")
      .update(dados)
      .eq("id", id)
      .select()
      .single();






  if(error){

    console.error(
      "Erro editando modelo:",
      error
    );

    return null;

  }





  return data;

}












// EXCLUIR MODELO
export async function excluirModeloCPL(id) {


  const { error } =
    await supabase
      .from("modelos_aliancas_cpl")
      .delete()
      .eq(
        "id",
        id
      );





  if(error){

    console.error(
      "Erro excluindo modelo:",
      error
    );

    return false;

  }





  return true;

}