import { useEffect } from "react";


function GerarImagemOrcamento({
  fotoModelo,
  onGerada
}) {


  useEffect(() => {


    if (!fotoModelo) return;


    async function gerarImagem() {


      try {


        console.log("GERANDO FOTO PURA");
        console.log("FOTO:", fotoModelo);


        const resposta = await fetch(
          fotoModelo
        );


        const blob = await resposta.blob();


        const arquivo = new File(
          [blob],
          "modelo-anel.png",
          {
            type: blob.type
          }
        );


        console.log(
          "ARQUIVO FOTO PURA:",
          arquivo
        );


        onGerada(arquivo);


      } catch (erro) {


        console.error(
          "Erro gerar foto:",
          erro
        );


      }


    }


    gerarImagem();


  }, [
    fotoModelo,
    onGerada
  ]);



  return null;


}


export default GerarImagemOrcamento;