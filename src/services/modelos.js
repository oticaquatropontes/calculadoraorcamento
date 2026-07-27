import { supabase } from '../supabase';


// Buscar todos os modelos
export async function buscarModelos() {

  const { data, error } = await supabase
    .from('modelos_aneis')
    .select('*')
    .order('criado_em', { ascending: false });


  if (error) {

    console.error('Erro ao buscar modelos:', error);
    return [];

  }


  return data;

}




// Buscar modelo por nome
export async function buscarModeloPorNome(nome) {

  if (!nome || !nome.trim()) {
    return null;
  }


  const { data, error } = await supabase
    .from('modelos_aneis')
    .select('*')
    .ilike('nome_modelo', nome.trim())
    .maybeSingle();



  if (error) {

    console.error(
      "Erro ao buscar modelo:",
      error
    );

    return null;

  }


  return data;

}




// Upload da foto
export async function uploadFotoModelo(arquivo, nomeModelo) {

  const extensao = arquivo.name.split('.').pop();


  const nomeArquivo =
    `${nomeModelo}_${Date.now()}.${extensao}`;


  const caminho = nomeArquivo;



  const { error } = await supabase.storage
    .from('modelos-aneis')
    .upload(caminho, arquivo);



  if (error) {

    console.error(
      'Erro upload:',
      error
    );

    return null;

  }




  const { data } = supabase.storage
    .from('modelos-aneis')
    .getPublicUrl(caminho);



  return data.publicUrl;

}




// Salvar novo modelo
export async function salvarModelo(nomeModelo, fotoUrl) {


  const { error } = await supabase
    .from('modelos_aneis')
    .insert({

      nome_modelo: nomeModelo,
      foto_url: fotoUrl

    });



  if (error) {

    console.error(
      "Erro ao salvar modelo:",
      error
    );

    return false;

  }


  return true;

}




// Atualizar foto do modelo
export async function atualizarFotoModelo(id, novaFotoUrl) {


  const { error } = await supabase
    .from('modelos_aneis')
    .update({

      foto_url: novaFotoUrl

    })
    .eq('id', id);



  if (error) {

    console.error(
      "Erro ao atualizar foto:",
      error
    );

    return false;

  }


  return true;

}