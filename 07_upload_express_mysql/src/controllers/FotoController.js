import {
    apagarFoto,
  atualizarFoto,
  criandoFoto,
  mostrandoFoto,
  mostraUmaFoto,
} from "../models/FotoModel.js";
import path from "path";
import url from "url";
import {promises as fs} from 'fs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createFoto = async (req, res) => {
  console.log("FotoController :: createFoto");
  // const caminho = req.body.caminho;
  const { alternativo } = req.body;
  // o ou representado pelo '||' faz com que se não receber arquivo receba um '{}' que é objeto vazio
  const { foto } = req.files || {};
  //const [caminho,alternativo] = req.body;

  if (!alternativo || !foto) {
    return res
      .status(400)
      .json({ mensagem: "A imagem e a descrição são obrigatórios" });
  }
  const nomeFoto = foto.name;
  const extensao = path.extname(nomeFoto).toLocaleLowerCase();
  
  //Extensões permitidas
  const extensoesPermitidas = ['.jpg','.jpeg','.png', '.webp'];
  if(!extensoesPermitidas.includes(extensao)){
    return res.status(400).json({ mensagem: "Extensão invalida" });
  }

  const caminho = `${Date.now()}${extensao}`;
  try {
    await foto.mv(path.join(__dirname, "..", "..", "public", "img", caminho));
    const [status, resposta] = await criandoFoto(caminho, alternativo);
    return res.status(status).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "erro ao criar foto" });
  }
};

export const readFoto = async (req, res) => {
  console.log("FotoController :: readFoto");
  try {
    const [status, resposta] = await mostrandoFoto();
    return res.status(status).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "erro ao mostra fotos" });
  }
};

export const updateFoto = async (req, res) => {
  console.log("FotoController :: updateFoto");
  const { id_foto } = req.params;
  const { alternativo } = req.body;
  try {
    const [status, resposta] = await atualizarFoto(alternativo, id_foto);
    return res.status(status).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "erro ao atualizar fotos" });
  }
};

export const deleteFoto = async (req,res) =>{
    console.log('FotoController :: deleteFoto');
    const {id_foto} = req.params;
    try {
        // Chama a função que verifica se a foto existe e trás o objeto com o caminho dela
        const [statusFoto, respostaFoto] = await mostrarCaminho(req,res);
        // Se a foto não existir retornará 404
        if(statusFoto === 404){
          return res.status(statusFoto).json(respostaFoto)  
        }
        // Montar caminho imagem
        const caminhoImagem = path.join(__dirname, "..", "..", "public", "img", respostaFoto.caminho);
        await fs.unlink(caminhoImagem);
        const [status,resposta] = await apagarFoto(id_foto);
        return res.status(status).json(resposta);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "erro ao deletar fotos" });        
    }
}

export const showOneFoto = async (req,res)  =>{
  console.log('FotoController :: showOneFoto');
  const [status,resposta] = await mostrarCaminho(req,res);
  return res.status(status).json(resposta);       
}

export const mostrarCaminho = async (req,res) =>{
    console.log('FotoController :: mostrarCaminho');
    const {id_foto} = req.params;
    try {
        const [status,resposta] = await mostraUmaFoto(id_foto);
        return [status,resposta];
        //return res.status(status).json(resposta);    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "erro ao mostrar uma foto" });   
    }    
}