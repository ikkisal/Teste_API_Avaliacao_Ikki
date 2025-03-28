import db from "../conexao.js";
import mysql from "mysql2/promise";

//Criando pool com database inet
const conexao = mysql.createPool(db);

//Criando foto
export const criandoFoto = async (caminho, alternativo) => {
  console.log("FotoModel :: criandoFoto");

  //SQL de Inserção
  const sql = `INSERT INTO
                    fotos (caminho,alternativo)
                    VALUES (?,?)
                `;

  const params = [caminho, alternativo];

  try {
    const [resposta] = await conexao.query(sql, params);
    return [201, { mensagem: "Foto cadastrada" }];
  } catch (error) {
    console.error({mensagem: "Erro Servidor", code: error.code,sql: error.sqlMessage});
    return [
      500,{
        mensagem: "Erro Servidor", 
        code: error.code,
        sql: error.sqlMessage },
    ];
  }
};

//Mostrando Foto
export const mostrandoFoto = async() => {
  console.log('FotoModel :: mostrandoFoto');

  //SQL de Seleção
  const sql = `SELECT * FROM fotos`;

  try {
    const [resposta] = await conexao.query(sql);
    return [200,resposta];
  } catch (error) {
    console.error({mensagem: "Erro Servidor", code: error.code,sql: error.sqlMessage});
    return [
      500,{
        mensagem: "Erro Servidor", 
        code: error.code,
        sql: error.sqlMessage },
    ];     
  }
}
//o atualizar apenas atualiza a descrição da foto
export const atualizarFoto = async(alternativo,id_foto) =>{
  console.log('FotoModel :: atualizarFoto');

  //SQL de Update
  const sql = `UPDATE fotos SET alternativo = ? WHERE id_foto = ?`;
  const params = [alternativo, id_foto];

  try {
    const [resposta] = await conexao.query(sql,params);
    if(resposta.affectedRows<1){
     return [404,{mensagem:'Imagem não encontrada'}]  
    }
    return [200,{mensagem:'Texto descrição atualizado'}];
  } catch (error) {
    console.error({mensagem: "Erro Servidor", code: error.code,sql: error.sqlMessage});
    return [
      500,{
        mensagem: "Erro Servidor", 
        code: error.code,
        sql: error.sqlMessage },
    ];   
  }
}

export const apagarFoto = async(id_foto) =>{
  console.log('FotoModel :: apagarFoto');
  //SQL de Delete
  const sql = `DELETE FROM fotos WHERE id_foto = ?`;
  const params = [id_foto];

  try {
    const [resposta] = await conexao.query(sql,params);
    if (resposta.affectedRows<1){
      return [404,{mensagem:'Imagem não encontrada'}]  
    }
    return [200,{mensagem:'Imagem Deletada'}]
  } catch (error) {
    return [
      500,{
        mensagem: "Erro Servidor", 
        code: error.code,
        sql: error.sqlMessage },
    ];   
  }
}

export const mostraUmaFoto = async(id_foto) =>{
  console.log('FotoModel :: mostraUmaFoto');
  //SQL de SELECT
  const sql = `SELECT * FROM fotos WHERE id_foto = ?`;
  const params = [id_foto];

  try {
    const [resposta] = await conexao.query(sql,params);
    if(resposta.length<1){
      return [404,{mensagem:'Imagem não encontrada'}];  
    }
    return[200,resposta[0]];
  } catch (error) {
    return [
      500,{
        mensagem: "Erro Servidor", 
        code: error.code,
        sql: error.sqlMessage },
    ]; 
  }

}