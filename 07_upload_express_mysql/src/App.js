import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import url from 'url';
import { createFoto, deleteFoto, readFoto, showOneFoto, updateFoto } from './controllers/FotoController.js';
import cors from 'cors';

const port = 3000;
const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Habilitando uso do Cors
app.use(cors());

//Habilitando uso do JSON importante pois permite o uso JSON
app.use(express.json());

//Habilitando upload de arquivos
app.use(fileUpload())

//permitindo acesso ao public
app.use('/public/img',express.static(path.join(__dirname,'..','public','img')));

app.get('/',(req,res)=>{
    res.status(200).json({mensagem:'API Funcionando'})
});

//CRUD Fotos
app.post('/foto',createFoto);
app.get('/foto',readFoto);
app.put('/foto/:id_foto',updateFoto);
app.delete('/foto/:id_foto',deleteFoto);

app.get('/foto/:id_foto',showOneFoto);

app.listen(port,()=>{
    console.log(`API Funcionando ${port}`);
});