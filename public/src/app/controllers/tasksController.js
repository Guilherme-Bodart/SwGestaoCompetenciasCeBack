const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Atividade = require('../models/Atividade');

const SubCategoria = require('../models/SubCategoria');

const Categoria = require('../models/Categoria');

const Projeto = require('../models/Projeto'); 

const ItemProjetoUsuario = require('../models/ItemProjetoUsuario');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const atividades = await Atividade.find().populate(['titulo', 'descricao']);
      return res.send({ atividades })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar as atividades'})
    }
});

router.get('/:atividadeId', async (req, res) => {
    try {
  
      const atividade = await Atividade.findById(req.params.atividadeId);
  
      return res.send({ atividade })
  
    } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega a atividade'})
    }
});

router.post('/', async (req, res) => {
    try {

      const { titulo, descricao, dataInicial, dataFinal, categoria, subcategoria, projeto } = req.body
      
      if(await Categoria.findById(categoria) && await SubCategoria.findById(subcategoria)){

        const item_projetoUsuario = await ItemProjetoUsuario.findOne({usuario: "6001bfe94c87342664565fd1", projeto: projeto});

        if(item_projetoUsuario){
          
          const atividade = await Atividade.create({ usuario: "6001bfe94c87342664565fd1", titulo, descricao, dataInicial, dataFinal, categoria, subcategoria, item_usuario_projeto: item_projetoUsuario._id })
        
          await atividade.save()

          const projeto_escolhido = await Projeto.findById(projeto);

          projeto_escolhido.atividades.push(atividade);

          await projeto_escolhido.save();
        
          return res.send({ atividade })
        
        }else{
          
          return res.status(400).send({ error: 'Erro em criar a atividade - Usuario nao vinculado ao projeto'})
        
        }

      }else{

        return res.status(400).send({ error: 'Erro em criar a atividade - Subcategoria, Categoria ou Projeto nao encontrado'})

      }

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar a atividade - '+err})
    }
});

router.delete('/:atividadeId', async (req, res) => {
    try {
      if(req.params.atividadeId){
      await Atividade.findByIdAndDelete(req.params.atividadeId);
      }
      else{
        await Atividade.findByIdAndDelete(req.query.atividadeId);
      }
  
      return res.send({ })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar a atividade'})
    }  
});

module.exports = app => app.use('/tasks', router);