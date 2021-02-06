const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Categoria = require('../models/categoria');

const SubCategoria = require('../models/subcategoria');

const Pessoa = require('../models/pessoa');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      
      const categorias = await Categoria.find({status: 1}).sort('nome').populate(['usuario']);

      if(categorias){
        await Promise.all(categorias.map(async (categoria, index) => {
          var id_pessoa = categoria.usuario.pessoa;
          const pessoa = await Pessoa.findById(id_pessoa);
          categoria.usuario.pessoa = pessoa;
          const subcategorias = await SubCategoria.find({categoria: categoria._id, status: 1});
          if(subcategorias){
            categoria.subcategorias = subcategorias;
          }
        }));
      }


      return res.send({ categorias })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar as categorias'+err})
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

router.put('/:categoriaId', async (req, res) => {
  try {

      var { nome } = req.query
      if (nome === undefined){
        var { nome } = req.body
      }

      const categoria = await Categoria.findByIdAndUpdate(req.params.categoriaId);

      if(categoria){
        
        categoria.nome = nome;
        
        await categoria.save()
        
        return res.send({ categoria })
      
      }else{
        return res.status(400).send({ error: 'Erro ao editar a categoria'})
      }

  } catch (err) {
      return res.status(400).send({ error: 'Erro ao editar a categoria'})
  }
});

router.get('/:categoriaId/subcategory', async (req, res) => {
  try {

    const subcategorias = await SubCategoria.find({categoria: req.params.categoriaId, status: 1});

    return res.send({ subcategorias })

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
        if(nome=='' || nome==undefined){
          return res.status(400).send({ error: 'Erro em criar a categoria'})
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

      const categoria = await Categoria.findByIdAndUpdate(req.params.categoriaId)

      categoria.status = 0;

      await categoria.save()

      return res.send({ })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar a categoria'})
    }  
});

module.exports = app => app.use('/category', router);