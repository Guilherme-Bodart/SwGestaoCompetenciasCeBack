const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Usuario = require('../models/usuario');
const Pessoa = require('../models/pessoa');

const Atividade = require('../models/atividade');

const Projeto = require('../models/projeto');

const ItemProjetoUsuario = require('../models/itemProjetoUsuario');

const Categoria = require('../models/categoria');
const SubCategoria = require('../models/subcategoria');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const usuarios = await Usuario.find().populate('pessoa');
      return res.send({ usuarios })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os usuarios'})
    }
});

router.get('/:usuarioId', async (req, res) => {
    try {
  
      const usuario = await Usuario.findById(req.params.usuarioId);

      if(usuario){
        var id_pessoa = usuario.pessoa;
        const pessoa = await Pessoa.findById(id_pessoa);
        usuario.pessoa = pessoa;
        }
  
      return res.send({ usuario })
  
    } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega o usuario'})
    }
});

router.put('/:usuarioId', async(req, res) => {

	var { email, nome, dataNascimento, telefone, endereco, cpf, permissao } = req.query
	
  if (nome === undefined){
		var { email, nome, dataNascimento, telefone, endereco, cpf, permissao } = req.body
	}
	
	try{

    const usuario = await Usuario.findByIdAndUpdate(req.params.usuarioId).select('+senha');

    if(usuario){

      const pessoa = await Pessoa.findByIdAndUpdate(usuario.pessoa);

      if(pessoa){

        pessoa.nome = nome
        pessoa.dataNascimento = dataNascimento
        pessoa.cpf = cpf
        pessoa.endereco = endereco
        pessoa.telefone = telefone.toString()

        await pessoa.save()

        usuario.permissao = permissao
        usuario.email = email

        await usuario.save()

        usuario.senha = undefined

      }else{
        return res.status(400).send({
          error: 'Falha ao editar o usuário1'
        })
      }

    }else{
      return res.status(400).send({
        error: 'Falha ao editar o usuário2'
      })
    }

		return res.send({usuario});
	
	} catch (err){
		return res.status(400).send({
			error: 'Falha ao editar o usuário'+err
		})
	}
})


router.get('/:usuarioId/tasks', async (req, res) => {
    try {
        const atividades = await Atividade.find({usuario: req.params.usuarioId, status: 1}).sort('nome').populate('categoria').populate('subcategoria').populate('item_usuario_projeto')
        if(atividades){
            await Promise.all(atividades.map(async atividade => {

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
            
            }));
        }

        return res.send({ atividades })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega as atividades do usuario'})
    }
});

router.get('/:usuarioId/projects', async (req, res) => {
    try {
        const projetos = await ItemProjetoUsuario.find({usuario: req.params.usuarioId, status: 1}).populate('projeto')

        if(projetos){
          await Promise.all(projetos.map(async projeto => {
              projeto = projeto.projeto
              var id_usuario = projeto.usuarioCriacao;
              const usuario = await Usuario.findById(id_usuario);
              projeto.usuarioCriacao = usuario;

              var id_pessoa = projeto.usuarioCriacao.pessoa;
              const pessoa = await Pessoa.findById(id_pessoa);
              projeto.usuarioCriacao.pessoa = pessoa;

          }));
        }
        
        return res.send({ projetos })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega os projetos do usuario'})
    }
});

router.delete('/:usuarioId', async (req, res) => {
  try {

    const usuario = await Usuario.findByIdAndUpdate(req.params.usuarioId).select('+senha');

    usuario.status = 0;

    await usuario.save()

    const item_projetoUsuario = await ItemProjetoUsuario.find({usuario: usuario._id});

    if(item_projetoUsuario){
      
      await Promise.all(item_projetoUsuario.map(async item => {

        item.status = 0

      }));

      item_projetoUsuario.save()
    }

    return res.send({ })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em desativar o usuário'})
  }  
});

module.exports = app => app.use('/users', router);