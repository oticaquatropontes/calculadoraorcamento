import { supabase } from "../supabase";

export async function buscarClientesPorNome(nome) {
  if (!nome.trim()) return [];

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .ilike("nome_cliente", `%${nome}%`)
    .order("nome_cliente");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function criarCliente(nome) {
  const { data, error } = await supabase
    .from("clientes")
    .insert([
      {
        nome_cliente: nome,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}