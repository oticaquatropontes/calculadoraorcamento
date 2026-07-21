import { supabase } from "../supabase";


export async function entrar(email, senha) {


  const { data, error } =
    await supabase.auth.signInWithPassword({

      email,

      password: senha

    });



  if (error) {

    console.log(
      "Erro login:",
      error
    );

    return false;

  }



  return true;


}





export async function verificarSessao() {


  const {

    data

  } = await supabase.auth.getSession();



  return !!data.session;


}





export async function sair() {


  await supabase.auth.signOut();


}