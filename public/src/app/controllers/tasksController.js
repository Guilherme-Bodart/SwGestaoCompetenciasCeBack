const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Atividade = require('../models/atividade');

const SubCategoria = require('../models/subcategoria');

const Categoria = require('../models/categoria');

const Projeto = require('../models/projeto'); 

const ItemProjetoUsuario = require('../models/itemProjetoUsuario');

const Usuario = require('../models/usuario');

const Pessoa = require('../models/pessoa');

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

      if(atividade){
        var id_item_usuario_projeto = atividade.item_usuario_projeto;
        const item_usuario_projeto = await ItemProjetoUsuario.findById(id_item_usuario_projeto);
        atividade.item_usuario_projeto = item_usuario_projeto;

        var id_projeto = atividade.item_usuario_projeto.projeto;
        const projeto = await Projeto.findById(id_projeto);
        atividade.item_usuario_projeto.projeto = projeto;

        var id_categoria = atividade.categoria;
        const categoria = await Categoria.findById(id_categoria);
        atividade.categoria = categoria;

        var id_subcategoria = atividade.subcategoria;
        const subcategoria = await SubCategoria.findById(id_subcategoria);
        atividade.subcategoria = subcategoria;

        var id_usuario = atividade.usuario;
        const usuario = await Usuario.findById(id_usuario);
        atividade.usuario = usuario;

        var id_pessoa = atividade.usuario.pessoa;
        const pessoa = await Pessoa.findById(id_pessoa);
        atividade.usuario.pessoa = pessoa;

      }
  
      return res.send({ atividade })
  
    } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega a atividade'})
    }
});

router.post('/', async (req, res) => {
    try {

      var { titulo, descricao, dataInicial, dataFinal, categoria, subcategoria, projeto } = req.query
      
      if (titulo === undefined){
        var { titulo, descricao, dataInicial, dataFinal, categoria, subcategoria, projeto } = req.body
      }
      
      if(await Categoria.findById(categoria) && await SubCategoria.findById(subcategoria)){

        const item_projetoUsuario = await ItemProjetoUsuario.findOne({usuario: req.usuarioId, projeto: projeto});

        if(item_projetoUsuario){
          
          const atividade = await Atividade.create({ usuario: req.usuarioId, titulo, descricao, dataInicial, dataFinal, categoria, subcategoria, item_usuario_projeto: item_projetoUsuario._id })
        
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
        return res.status(400).send({ error: 'Erro em criar a atividade'})
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