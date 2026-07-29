import { supabase } from "../supabase";


export async function salvarOrcamentoCPL(dados) {


  const { data, error } = await supabase
    .from("orcamentos_cpl")
    .insert([
      {
        cliente_id: dados.cliente_id,

        tipo_orcamento: dados.tipo_orcamento,

        modelo_alianca_1: dados.modelo_alianca_1,

        modelo_alianca_2: dados.modelo_alianca_2,

        data_orcamento: dados.data_orcamento,

        peso_alianca_1: dados.peso_alianca_1,

        peso_alianca_2: dados.peso_alianca_2,

        valor_orcamento: dados.valor_orcamento,

        texto_orcamento: dados.texto_orcamento,

        imagem_url: dados.imagem_url || null,

        codigo_publico: dados.codigo_publico || null
      }
    ])
    .select()
    .single();



  if(error){

    console.error(
      "Erro ao salvar orçamento CPL:",
      error
    );

    return null;

  }


  return data;


}