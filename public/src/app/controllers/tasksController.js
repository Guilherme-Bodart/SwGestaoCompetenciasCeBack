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
      
      if(await Categoria.findById(categoria) && await SubCategoria.findById(subcategoria) && await Projeto.findById(projeto)){

        const itemProjetoUsuario = await ItemProjetoUsuario.findOne({ usuario: req.usuarioId, projeto: projeto});

        if(itemProjetoUsuario){
          
          const atividade = await Atividade.create({ usuario: req.usuarioId, titulo, descricao, dataInicial, dataFinal, categoria, subcategoria })
        
          await atividade.save()

          itemProjetoUsuario.atividades.push(atividade)

          /* TRAVEI AQI NAO CONSIGO FAZER ISSO PQP */
        
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