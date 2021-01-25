const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Usuario = require('../models/Usuario');

const Atividade = require('../models/Atividade');

const Projeto = require('../models/Projeto');

const ItemProjetoUsuario = require('../models/ItemProjetoUsuario');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const usuarios = await Usuario.find();
      return res.send({ usuarios })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os usuarios'})
    }
});

router.get('/:usuarioId', async (req, res) => {
    try {
  
      const usuario = await Usuario.findById(req.params.usuarioId);
  
      return res.send({ usuario })
  
    } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega o usuario'})
    }
});

router.get('/:usuarioId/tasks', async (req, res) => {
    try {
        const atividades = await Atividade.find({usuario: req.params.usuarioId}).sort('nome').populate('categoria').populate('subcategoria').populate('item_usuario_projeto')
        
        await Promise.all(atividades.map(async atividade => {

            var id_projeto = atividade.item_usuario_projeto.projeto;
            const projeto = await Projeto.findById(id_projeto);
            atividade.item_usuario_projeto.projeto = projeto;
        
        }));

        return res.send({ atividades })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega as atividades do usuario'})
    }
});

router.get('/:usuarioId/projects', async (req, res) => {
    try {
        const projetos = await ItemProjetoUsuario.find({usuario: req.params.usuarioId, status: 1}).sort('nome').populate('projeto')

        return res.send({ projetos })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega as atividades do usuario'})
    }
});

module.exports = app => app.use('/users', router);