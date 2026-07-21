import { useState } from "react";
import { entrar } from "../../services/auth";
import "./Login.css";


function Login({ onLogin }) {


  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");

  const [carregando, setCarregando] = useState(false);



  async function fazerLogin(e) {

    e.preventDefault();


    setErro("");

    setCarregando(true);



    const sucesso = await entrar(
      email,
      senha
    );



    if (sucesso) {

      onLogin();

    } else {

      setErro(
        "Login ou senha incorretos"
      );

    }



    setCarregando(false);

  }



  return (

    <div className="login-container">


      <div className="login-card">


        <h1>
          Ótica e Relojoaria
        </h1>


        <h2>
          Quatro Pontes
        </h2>


        <p>
          Acesso ao aplicativo
        </p>



        <form onSubmit={fazerLogin}>


          <input

            type="email"

            placeholder="Login"

            value={email}

            onChange={(e)=>
              setEmail(e.target.value)
            }

          />



          <input

            type="password"

            placeholder="Senha"

            value={senha}

            onChange={(e)=>
              setSenha(e.target.value)
            }

          />



          <label className="lembrar">


            <input

              type="checkbox"

            />


            Lembrar credenciais


          </label>




          {erro && (

            <p className="erro">

              {erro}

            </p>

          )}




          <button type="submit">


            {carregando
              ? "Entrando..."
              : "Entrar"
            }


          </button>



        </form>



      </div>


    </div>

  );


}


export default Login;