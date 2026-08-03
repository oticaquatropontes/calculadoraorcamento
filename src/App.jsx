import { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import VisualizarOrcamento from "./pages/AnelFormatura/VisualizarOrcamento/VisualizarOrcamento";
import VisualizarOrcamentoCPL from "./pages/AliancasCPL/VisualizarOrcamentoCPL";
import { verificarSessao } from "./services/auth";

function App() {

  // Se abriu um link de orçamento, mostra a página pública
  if (window.location.pathname.startsWith("/orcamento-cpl")) {

  console.log("ENTROU NA ROTA CPL");

  return <VisualizarOrcamentoCPL />;

}


if (window.location.pathname.startsWith("/orcamento/")) {
  return <VisualizarOrcamento />;
}

  const [logado, setLogado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    verificarLogin();
  }, []);

  async function verificarLogin() {

    const sessao = await verificarSessao();

    setLogado(sessao);
    setCarregando(false);

  }

  if (carregando) {

    return (
      <div>
        Carregando...
      </div>
    );

  }

  if (!logado) {

    return (
      <Login
        onLogin={() => setLogado(true)}
      />
    );

  }

  return <Home />;

}

export default App;