import { useState } from 'react';
import NovoOrcamento from './NovoOrcamento/NovoOrcamento';
import ConfiguracaoIndice from './ConfiguracaoIndice/ConfiguracaoIndice';
import ConsultarOrcamentos from './ConsultarOrcamentos/ConsultarOrcamentos';
import RegistroModelos from './RegistroModelos/RegistroModelos';
import './AnelFormatura.css';

function AnelFormatura({ voltar }) {
  const [tela, setTela] = useState('inicio');

  // Novo orçamento
  if (tela === 'orcamento') {
    return (
      <NovoOrcamento
        voltar={() => setTela('inicio')}
      />
    );
  }

  // Configuração do índice
  if (tela === 'configuracao') {
    return (
      <ConfiguracaoIndice
        voltar={() => setTela('inicio')}
      />
    );
  }

  // Consultar orçamentos
  if (tela === 'consultar') {
    return (
      <ConsultarOrcamentos
        voltar={() => setTela('inicio')}
      />
    );
  }

  // Registro de modelos
  if (tela === 'modelos') {
    return (
      <RegistroModelos
        voltar={() => setTela('inicio')}
      />
    );
  }

  return (
    <div className="container">

      <h1>💍 Anéis de Formatura</h1>

      <button onClick={() => setTela('configuracao')}>
        ⚙️ Configuração do Índice
      </button>

      <button onClick={() => setTela('orcamento')}>
        🧾 Novo Orçamento
      </button>

      <button onClick={() => setTela('consultar')}>
        📂 Consultar Orçamentos
      </button>

      <button onClick={() => setTela('modelos')}>
        📸 Registro de Modelos
      </button>

      <button className="voltar" onClick={voltar}>
        ⬅ Voltar
      </button>

    </div>
  );
}

export default AnelFormatura;