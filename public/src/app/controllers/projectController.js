const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Projeto = require('../models/Projeto');

const Atividade = require('../models/Atividade');

const ItemProjetoUsuario = require('../models/ItemProjetoUsuario');

const Usuario = require('../models/Usuario');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const projetos = await Projeto.find().populate(['atividades']);
      return res.send({ projetos })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os projetos'})
    }
});

router.get('/tasks', async (req, res) => {
  try {
      const atividades = await Atividade.find().sort('nome')
      return res.send({ atividades })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega as atividades'})
  }
});

router.get('/title', async (req, res) => {
  try {
      const projetos = await Projeto.find({},{nome:1}).sort('name')
      return res.send({ projetos })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega os projetos'})
  }
});

router.get('/:projetoId', async (req, res) => {
  try {

    const projeto = await Projeto.findById(req.params.projetoId).populate(['atividades']);

    return res.send({ projeto })

  } catch (err) {
    return res.status(400).send({ error: 'Erro em carrega o projeto'})
  }
});


router.post('/', async (req, res) => {
    try {

      const { nome, descricao, equipe } = req.body
      /*(if (token === undefined || token === '' || nome === undefined || descricao === undefined){
        nome, descricao, equipe, token = req.body
      }*/

      const projeto = await Projeto.create({ nome, descricao, usuarioCriacao: req.usuarioId, equipe })
	  
      await Promise.all(equipe.map(async id_usuario => {

        const usuario = await Usuario.findById(id_usuario)
        if(usuario){

          var itemProjetoUsuario = new ItemProjetoUsuario({usuario: usuario._id, projeto: projeto._id})
          
          await itemProjetoUsuario.save()
          
        }
      }));

      await projeto.save()
	    return res.send({ projeto })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar novo projeto - '+err})
    }
});

router.put('/:projetoId', async (req, res) => {
  
  try{
    let nome, descricao, equipe
    let tituloAtividade, usuario, descricaoAtividade, categoria, subcategoria
    if(req.body.title===undefined){
      nome = req.query.nome
      descricao = req.query.descricao
      equipe = req.query.equipe
      tituloAtividade = req.query.tituloAtividade
      usuario = req.query.usuario
      descricaoAtividade = req.query.descricaoAtividade
      categoria = req.query.categoria
      subcategoria = req.query.subcategoria
    }
    if (req.query.nome===undefined){
      nome = req.body.nome
      descricao = req.body.descricao
      equipe = req.body.equipe
      tituloAtividade = req.body.tituloAtividade
      usuario = req.body.usuario
      descricaoAtividade = req.body.descricaoAtividade
      categoria = req.body.categoria
      subcategoria = req.body.subcategoria
    }
    const atividade = {nome:tituloAtividade, usuario, descricao:descricaoAtividade, categoria, subcategoria}

    const projeto = await Projeto.findByIdAndUpdate(req.params.projetoId,
       {nome, descricao, equipe}, {new: true})
    const projetoAtividade = await new Atividade({ ...atividade, projeto: projeto._id})
    await projetoAtividade.save()

    projeto.atividades.push(projetoAtividade)
    await projeto.save()

    return res.send({projeto})
  }
  catch(err){
      return res.status(400).send({error:"Erro em criar novo projeto"})
  }
});

router.delete('/:projetoId', async (req, res) => {
    try {
      if(req.params.projetoId){
      await Projeto.findByIdAndDelete(req.params.projetoId);
      }
      else{
        await Projeto.findByIdAndDelete(req.query.projetoId);
      }
  
      return res.send({ })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar o projeto'})
    }  
});

module.exports = app => app.use('/projects', router);