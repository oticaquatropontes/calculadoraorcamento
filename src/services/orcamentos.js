import { supabase } from "../supabase";


export async function salvarOrcamento(dados) {

  const { error } = await supabase
    .from("orcamentos")
    .insert([
      {
        cliente_id: dados.cliente_id,
        modelo_anel: dados.modelo,
        indice_calculo: dados.indiceCalculo,
        texto_orcamento: dados.texto,
        data_orcamento: new Date().toISOString().split("T")[0],
      },
    ]);


  if (error) {

    console.error("Erro ao salvar orçamento:", error);
    return false;

  }


  return true;

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


  if (error) {

    console.error(
      "Erro buscando orçamentos:",
      error
    );

    return [];

  }


  return data;

}