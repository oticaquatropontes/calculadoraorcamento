import { supabase } from "../supabase";



export async function buscarClientesPorNome(nome) {

  if (!nome.trim()) return [];


  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .ilike("nome_cliente", `%${nome}%`)
    .order("nome_cliente");


  if (error) {

    console.error(
      "Erro buscando clientes:",
      error
    );

    return [];

  }


  return data;

}







export async function criarCliente(nome) {


  const { error } = await supabase
    .from("clientes")
    .insert([
      {
        nome_cliente: nome,
      },
    ]);


  if (error) {

    console.error(
      "Erro criando cliente:",
      error
    );

    return null;

  }


  // busca o cliente recém criado para pegar o ID

  const { data, error: erroBusca } = await supabase
    .from("clientes")
    .select("id")
    .eq("nome_cliente", nome)
    .single();


  if (erroBusca) {

    console.error(
      "Erro buscando cliente criado:",
      erroBusca
    );

    return null;

  }


  return data;

}







export async function buscarOuCriarCliente(nome) {


  const nomeLimpo = nome.trim();


  if (!nomeLimpo) {

    console.log("Nome vazio");
    return null;

  }



  // procura cliente existente

  const { data: clienteExistente, error } = await supabase
    .from("clientes")
    .select("id")
    .eq("nome_cliente", nomeLimpo)
    .maybeSingle();



  if (error) {

    console.error(
      "Erro buscando cliente:",
      error
    );

    return null;

  }



  // encontrou

  if (clienteExistente) {

    console.log(
      "Cliente encontrado:",
      clienteExistente.id
    );

    return clienteExistente.id;

  }



  // não encontrou, cria

  console.log(
    "Criando novo cliente:",
    nomeLimpo
  );


  const novoCliente = await criarCliente(nomeLimpo);



  if (!novoCliente) {

    return null;

  }



  console.log(
    "Cliente criado:",
    novoCliente.id
  );


  return novoCliente.id;


}