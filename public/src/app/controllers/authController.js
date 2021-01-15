const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth');

const Usuario = require('../models/Usuario');

const Pessoa = require('../models/Pessoa');

const router = express.Router();

function generateToken(params = {}) {
	return jwt.sign(params, authConfig.secret, {
		expiresIn: 86400
	});
}

router.post('/register', async(req, res) => {
	var verif = 0
	var { email, senha, nome } = req.query
	
    if (email === undefined){
       email = req.body.email
       senha = req.body.senha
	   nome = req.body.nome
	   cpf = req.body.cpf
       verif = 1
	}
	
	if(email === "" || email === undefined){
		return res.status(401).send({error: "Campo E-Mail vazio"})
	}else if(senha === "" || senha === undefined){
		return res.status(403).send({error: "Campo Senha vazio"})
	}else if(nome === "" || nome === undefined){
		return res.status(402).send({error: "Campo Nome vazio"})
	}else if(cpf === "" || cpf === undefined){
		return res.status(402).send({error: "Campo Cpf vazio"})
	}

	try{

		if(await Pessoa.findOne({cpf})){
			return res.status(400).send({ error: 'pessoa ja existe'});
		}

		if(await Usuario.findOne({email})){
			return res.status(400).send({ error: 'Usuario ja existe'});
		}

		var usuario;
		var pessoa;
		if (verif){
			usuario = await Usuario.create(req.body);
			pessoa = await Pessoa.create(req.body);
        }else{
			usuario = await Usuario.create(req.query);
			pessoa = await Pessoa.create(req.query);
		}
		
		usuario.senha = undefined;
		usuario.pessoa = pessoa.id;

		return res.send({
			usuario, 
			token: generateToken({ id: usuario.id })
		});
	
	} catch (err){
		return res.status(400).send({
			error: 'Falha no registro'
		})
	}
})

router.post('/authenticate', async (req, res) => {
	var { email, senha } = req.query
    if (email === undefined && senha === undefined){
       email = req.body.email
       senha = req.body.senha
    }

	const usuario = await Usuario.findOne({email}).select('+senha');

	if(!usuario){
		return res.status(400).send({
			error: 'usuario not found'
		})
	}

	if(!await bcrypt.compare(senha, usuario.senha)){
		return res.status(400).send({
			error: 'Invalid senha'
		})
	}

	usuario.senha = undefined;

	res.send({
		usuario, 
		token: generateToken({ id: usuario.id })
	});

	return res.status(200);
})

router.get('/', async (req, res) => {
    try {
        const usuarios = await User.find({},{email:1}).sort('email')
        return res.send({ usuarios })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega os usuarios'})
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const usuarios = await User.findById(req.params.userId)
        return res.send({ usuarios })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega os usuarios'})
    }
});

module.exports = app => app.use('/auth', router);