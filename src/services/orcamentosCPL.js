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







export async function buscarOrcamentoCPLPorCodigo(codigo) {


  const codigoNormalizado =
    codigo.toUpperCase();



  const { data: orcamento, error } =
    await supabase
      .from("orcamentos_cpl")
      .select("*")
      .eq(
        "codigo_publico",
        codigoNormalizado
      )
      .single();





  if(error || !orcamento){


    console.error(
      "Erro buscando orçamento CPL:",
      error
    );


    return null;

  }






  const { data: cliente } =
    await supabase
      .from("clientes")
      .select(
        "nome_cliente"
      )
      .eq(
        "id",
        orcamento.cliente_id
      )
      .single();







  return {


    ...orcamento,


    clientes:
      cliente || null


  };


}









export async function buscarOrcamentosCPL() {



  const { data: orcamentos, error } =
    await supabase
      .from("orcamentos_cpl")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      );





  console.log(
    "ORÇAMENTOS CPL:",
    orcamentos
  );





  if(error){


    console.error(
      "Erro buscando orçamentos CPL:",
      error
    );


    return [];

  }






  if(!orcamentos || orcamentos.length === 0){

    return [];

  }








  const { data: clientes } =
    await supabase
      .from("clientes")
      .select(
        "id,nome_cliente"
      );








  const resultado = orcamentos.map(
    (orcamento)=>{


      const cliente =
        clientes?.find(
          (c)=>
            c.id === orcamento.cliente_id
        );



      return {


        ...orcamento,


        clientes:
          cliente || null


      };


    }

  );







  console.log(
    "ORÇAMENTOS CPL COM CLIENTE:",
    resultado
  );





  return resultado;



}