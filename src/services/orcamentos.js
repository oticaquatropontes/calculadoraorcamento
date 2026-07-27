import { supabase } from "../supabase";


export async function salvarOrcamento(dados) {

  const { data, error } = await supabase
    .from("orcamentos")
    .insert([
      {
        cliente_id: dados.cliente_id,
        modelo_anel: dados.modelo,
        indice_calculo: dados.indiceCalculo,
        texto_orcamento: dados.texto,
        imagem_url: dados.imagem_url,
        data_orcamento: new Date().toISOString().split("T")[0],
      },
    ])
    .select()
    .single();


  if (error) {

    console.error("Erro ao salvar orçamento:", error);
    return null;

  }

  console.log("ORÇAMENTO SALVO:", data);

  return data;

}



export async function buscarOrcamentos() {

  const { data, error } = await supabase
    .from("orcamentos")
    .select(`
      *,
      clientes (
        nome_cliente
      )
    `)
    .order("created_at", {
      ascending: false
    });


  console.log("DATA:", data);
  console.log("ERROR:", error);


  return data || [];

}




export async function uploadImagemOrcamento(arquivo) {

  if (!arquivo) {
    return null;
  }


  const nomeArquivo = `orcamento_${Date.now()}.png`;


  const { error } = await supabase.storage
    .from("orcamentos")
    .upload(nomeArquivo, arquivo);



  if (error) {

    console.error(
      "Erro upload imagem orçamento:",
      error
    );

    return null;

  }



  const { data } = supabase.storage
    .from("orcamentos")
    .getPublicUrl(nomeArquivo);



  return data.publicUrl;

}

export async function buscarOrcamentoPorId(id) {


  const { data, error } = await supabase
    .from("orcamentos")
    .select(`
      *,
      clientes (
        nome_cliente
      )
    `)
    .eq("id", id)
    .single();



  console.log("ORÇAMENTO INDIVIDUAL:", data);
  console.log("ERRO BUSCA INDIVIDUAL:", error);



  if (error) {

    console.error(
      "Erro buscando orçamento:",
      error
    );

    return null;

  }



  return data;

}