const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Categoria = require('../models/categoria');

const SubCategoria = require('../models/subcategoria');

const Pessoa = require('../models/pessoa');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const subcategorias = await SubCategoria.find({status: 1}).sort('nome').populate(['usuario', 'categoria']);
      
      if(subcategorias){
        await Promise.all(subcategorias.map(async subcategoria => {
          var id_pessoa = subcategoria.usuario.pessoa;
          const pessoa = await Pessoa.findById(id_pessoa);
          subcategoria.usuario.pessoa = pessoa;
        }));
      }

      return res.send({ subcategorias })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar as subcategorias'+err})
    }
});

router.get('/:subcategoriaId', async (req, res) => {
    try {
  
      const subcategoria = await SubCategoria.findById(req.params.subcategoriaId);
  
      return res.send({ subcategoria })
  
    } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega a subcategoria'})
    }
});

router.post('/', async (req, res) => {
    try {

        var { nome, categoria } = req.query
        if (nome === undefined || categoria === undefined){
          var { nome, categoria } = req.body
        }

        if(await Categoria.findById(categoria)){
            const subcategoria = await SubCategoria.create({ usuario: req.usuarioId, categoria, nome })
        
            await subcategoria.save()
            
            return res.send({ subcategoria })
        
        }else{

            return res.status(400).send({ error: 'Erro em criar a subcategoria - Categoria nao encontrada'})

        }

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar a subcategoria'})
    }
});

router.put('/:subcategoriaId', async (req, res) => {
  try {

      var { nome, categoria } = req.query
      if (nome === undefined || categoria === undefined){
        var { nome, categoria } = req.body
      }

      if(await Categoria.findById(categoria)){

          const subcategoria = await SubCategoria.findByIdAndUpdate(req.params.subcategoriaId)

          if(subcategoria){
            
            subcategoria.nome = nome;
            subcategoria.categoria = categoria;
            
            await subcategoria.save()
            
            return res.send({ subcategoria })
          
          }else{
            return res.status(400).send({ error: 'Erro ao editar a subcategoria - SubCategoria nao encontrada'})
          }
      
      }else{

          return res.status(400).send({ error: 'Erro ao editar a subcategoria - Categoria nao encontrada'})

      }

  } catch (err) {
      return res.status(400).send({ error: 'Erro ao editar a subcategoria'})
  }
});

router.delete('/:subcategoriaId', async (req, res) => {
    try {
      const subcategoria = await SubCategoria.findByIdAndUpdate(req.params.subcategoriaId)

      subcategoria.status = 0;

      await subcategoria.save()
  
      return res.send({ })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar a subcategoria'})
    }  
});

module.exports = app => app.use('/subcategory', router);