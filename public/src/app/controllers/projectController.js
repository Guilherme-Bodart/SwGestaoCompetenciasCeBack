const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Projeto = require('../models/projeto');

const Atividade = require('../models/atividade');

const ItemProjetoUsuario = require('../models/itemProjetoUsuario');

const Categoria = require('../models/categoria');
const SubCategoria = require('../models/subcategoria');

const Usuario = require('../models/usuario');
const Pessoa = require('../models/pessoa');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      
      const projetos = await Projeto.find({status: 1}).populate(['atividades', 'usuarioCriacao']);

      if(projetos){
        await Promise.all(projetos.map(async projeto => {
          var id_pessoa = projeto.usuarioCriacao.pessoa;
          const pessoa = await Pessoa.findById(id_pessoa);
          projeto.usuarioCriacao.pessoa = pessoa;
        }));
      }

      return res.send({ projetos })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os projetos'+err})
    }
});

router.get('/tasks', async (req, res) => {
  try {
      const atividades = await Atividade.find({status: 1}).sort('nome')
      return res.send({ atividades })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar as atividades'})
  }
});

router.get('/title', async (req, res) => {
  try {
      const projetos = await Projeto.find({status: 1}).sort('nome')
      return res.send({ projetos })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os projetos'})
  }
});

router.get('/:projetoId', async (req, res) => {
  try {

    const projeto = await Projeto.findById(req.params.projetoId).populate(['atividades', 'equipe']);

    if(projeto.equipe){
      await Promise.all(projeto.equipe.map(async usuario => {

        var id_pessoa = usuario.pessoa;
        const pessoa = await Pessoa.findById(id_pessoa);
        usuario.pessoa = pessoa;
    
      }));
    }

    if(projeto.atividades){
      await Promise.all(projeto.atividades.map(async atividade => {

        var id_item_usuario_projeto = atividade.item_usuario_projeto;
        const item_usuario_projeto = await ItemProjetoUsuario.findById(id_item_usuario_projeto);
        atividade.item_usuario_projeto = item_usuario_projeto;

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

      }));
    }

    return res.send({ projeto })

  } catch (err) {
    return res.status(400).send({ error: 'Erro em carregar o projeto'})
  }
});


router.post('/', async (req, res) => {
    try {

      var { nome, descricao, equipe, entregas } = req.query
      if (nome === undefined || descricao === undefined){
        var { nome, descricao, equipe, entregas } = req.body
      }
      if(nome!= '' && nome != undefined){
        const projeto = await Projeto.create({ nome, descricao, usuarioCriacao: req.usuarioId, equipe, entregas })
      
        await Promise.all(equipe.map(async id_usuario => {

          const usuario = await Usuario.findById(id_usuario)
          if(usuario){

            var itemProjetoUsuario = new ItemProjetoUsuario({usuario: usuario._id, projeto: projeto._id})
            
            await itemProjetoUsuario.save()
            
          }
        }));

        await projeto.save()
        return res.send({ projeto })
    }
    else {
        return res.status(400).send({ error: 'Erro em criar novo projeto'})
    }

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar novo projeto'})
    }
});

router.put('/:projetoId', async (req, res) => {
  
  try{

    var { nome, descricao, equipe, entregas } = req.query
    if (nome === undefined || descricao === undefined){
      var { nome, descricao, equipe, entregas } = req.body
    }

    if(equipe === undefined){
      equipe = []
    }
    
    if(entregas === undefined){
      entregas = []
    }

    const projeto = await Projeto.findByIdAndUpdate(req.params.projetoId)

    var equipe_completa = equipe.concat(projeto.equipe);

    await Promise.all(equipe_completa.map(async id_usuario => {
      if(id_usuario!=0 && id_usuario!= undefined && id_usuario!= ''){
      const usuario = await Usuario.findById(id_usuario)
        if(usuario){
          const existe_item = await ItemProjetoUsuario.findOne({usuario: usuario._id, projeto: projeto._id})
          if(!existe_item){

            var itemProjetoUsuario = new ItemProjetoUsuario({usuario: usuario._id, projeto: projeto._id})
            await itemProjetoUsuario.save()
          }else{

            if(equipe.find(element => element === id_usuario)){

              existe_item.status = 1;

              await existe_item.save()

            }else{

              existe_item.status = 0;

              await existe_item.save()

            }
          }
    
        }
      }
    }));

    
    projeto.nome = nome;
    projeto.descricao = descricao;
    projeto.equipe = equipe;
    projeto.entregas = entregas;
    
    await projeto.save()

    return res.send({projeto})
    
    
  }catch(err){
      return res.status(400).send({error:"Erro em editar o projeto "+err})
  }
});

router.delete('/:projetoId', async (req, res) => {
    try {

      const projeto = await Projeto.findByIdAndUpdate(req.params.projetoId)

      projeto.status = 0;

      await projeto.save()

      const item_projetoUsuario = await ItemProjetoUsuario.find({projeto: projeto._id});

      if(item_projetoUsuario){
        
        await Promise.all(item_projetoUsuario.map(async item => {

          item.status = 0
          item.save()

        }));
        
      }

      return res.send({ })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar o projeto'+err})
    }  
});

module.exports = app => app.use('/projects', router);