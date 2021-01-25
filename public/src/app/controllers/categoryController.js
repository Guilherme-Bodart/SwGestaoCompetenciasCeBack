const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Categoria = require('../models/Categoria');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const categorias = await Categoria.find();
      return res.send({ categorias })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar as categorias'})
    }
});

router.get('/:categoriaId', async (req, res) => {
    try {
  
      const categoria = await Categoria.findById(req.params.categoriaId);
  
      return res.send({ categoria })
  
    } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega a categoria'})
    }
});

router.post('/', async (req, res) => {
    try {

        var { nome } = req.query;
        if(nome === undefined){
          var {nome} = req.body;
        }

        const categoria = await Categoria.create({ usuario: req.usuarioId, nome })
      
        await categoria.save()
        
        return res.send({ categoria })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar a categoria'})
    }
});

router.delete('/:categoriaId', async (req, res) => {
    try {
      if(req.params.categoriaId){
      await Categoria.findByIdAndDelete(req.params.categoriaId);
      }
      else{
        await Categoria.findByIdAndDelete(req.query.categoriaId);
      }
  
      return res.send({ })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar a categoria'})
    }  
});

module.exports = app => app.use('/category', router);