import { useEffect, useState } from 'react';
import {
  buscarModelos,
  buscarModeloPorNome,
  uploadFotoModelo,
  salvarModelo,
  atualizarFotoModelo
} from '../../../services/modelos';
import './RegistroModelos.css';

function RegistroModelos({ voltar }) {
  const [nomeModelo, setNomeModelo] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [modelos, setModelos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarModelos();
  }, []);

  async function carregarModelos() {
    const dados = await buscarModelos();
    setModelos(dados);
  }

  async function salvar() {
    if (!nomeModelo.trim()) {
      alert('Informe o nome do modelo');
      return;
    }

    if (!arquivo) {
      alert('Selecione uma foto');
      return;
    }

    setCarregando(true);

    // Verifica se já existe
    const existente = await buscarModeloPorNome(nomeModelo.trim());

    // Upload da nova foto
    const fotoUrl = await uploadFotoModelo(
      arquivo,
      nomeModelo.trim()
    );

    if (!fotoUrl) {
      alert('Erro ao enviar a foto');
      setCarregando(false);
      return;
    }

    // Se já existe
    if (existente) {
      const confirmar = window.confirm(
        `O modelo \\"${nomeModelo}\\" já possui uma foto cadastrada.\\n\\nDeseja atualizar a foto deste modelo?`
      );

      if (!confirmar) {
        setCarregando(false);
        return;
      }

      const atualizado = await atualizarFotoModelo(
        existente.id,
        fotoUrl
      );

      if (atualizado) {
        alert('Foto do modelo atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar a foto');
      }

    } else {
      // Novo modelo
      const salvo = await salvarModelo(
        nomeModelo.trim(),
        fotoUrl
      );

      if (salvo) {
        alert('Modelo cadastrado com sucesso!');
      } else {
        alert('Erro ao salvar o modelo');
      }
    }

    // Limpa campos
    setNomeModelo('');
    setArquivo(null);

    // Recarrega lista
    await carregarModelos();

    setCarregando(false);
  }

  return (
    <div className="container">

      <h1>📸 Registro de Modelos</h1>

      <div className="registro-form">

        <label>Nome do modelo</label>

        <input
          value={nomeModelo}
          onChange={(e) => setNomeModelo(e.target.value)}
          placeholder="Ex.: ADM-23"
        />

        <label>Foto do modelo</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArquivo(e.target.files[0])}
        />

        <div className="botoes-registro">

  <button 
    onClick={salvar} 
    disabled={carregando}
  >

    {carregando ? 'Salvando...' : '💾 Salvar Modelo'}

  </button>


  <button 
    className="voltar"
    onClick={voltar}
  >

    ⬅ Voltar

  </button>

</div>

      </div>

      <hr />

      <h3>Modelos cadastrados</h3>

      <div className="lista-modelos">

        {modelos.length === 0 && (
          <p>Nenhum modelo cadastrado.</p>
        )}

        {modelos.map((modelo) => (

          <div key={modelo.id} className="card-modelo">

            <img
              src={modelo.foto_url}
              alt={modelo.nome_modelo}
            />

            <div className="info-modelo">

              <strong>{modelo.nome_modelo}</strong>

            </div>

          </div>

        ))}

      </div>

     
    </div>
  );
}

export default RegistroModelos;