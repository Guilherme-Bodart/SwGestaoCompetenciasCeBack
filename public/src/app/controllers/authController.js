const express = require('express');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const mailer = require('../../modules/mailer');

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
	var { email, senha, nome, dataNascimento, telefone, endereco, cpf, permissao } = req.query
	
    if (email === undefined){
		var { email, senha, nome, dataNascimento, telefone, endereco, cpf, permissao } = req.body
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
			error: 'usuario nao encontrado'
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
        const usuarios = await Usuario.find({},{email:1})
        return res.send({ usuarios })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega os usuarios'})
    }
});

router.get('/:userId', async (req, res) => {
    try {
		const usuario = await Usuario.findById(req.params.userId)
        return res.send({ usuario })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega os usuario'})
    }
});

router.post('/forgot_password', async (req, res) => {
	var { email } = req.query;
	if(email === undefined){
		var {email} = req.body;
	}

	try{

		const usuario = await Usuario.findOne({email})

		if(!usuario){
			return res.status(400).send({
				error: 'usuario nao encontrado'
			})
		}

		const token = crypto.randomBytes(20).toString('hex');
		const now = new Date();
		now.setHours(now.getHours()+1);

		await Usuario.findByIdAndUpdate(usuario.id, {
			'$set': {
				senhaResetToken: token,
				senhaResetExpires: now
			}
		});

		mailer.sendMail({
			to: email,
			from: 'LEDS Skills <leds.skills@gmail.com>',
			subject: 'Recuperação de Senha',
			template: 'auth/forgot_password',
			context: {token}
		}, (err) => {
			if(err){
				return res.status(400).send({error: 'Erro ao enviar o email de recuperacao'+err})
			}
			return res.send();
		})

	} catch (err){

		res.status(400).send({ error: 'Erro ao recuperar senha, tente novamente'+err})

	}

});

router.post('/reset_password', async (req, res) => {

	var {email, senha, token} = req.query;
	if(email === undefined){
		var {email, senha, token} = req.body;
	}

	try{

		const usuario = await Usuario.findOne({email})
			.select('+senhaResetToken senhaResetExpires');

		if(!usuario){
			return res.status(400).send({
				error: 'usuario nao encontrado'
			})
		}

		if(token !== usuario.senhaResetToken){
			return res.status(400).send({
				error: 'token invalido'
			})
		}

		const now = new Date();

		if(now > usuario.senhaResetToken){
			return res.status(400).send({
				error: 'token expirado'
			})
		}

		usuario.senha = senha;

		await usuario.save();

		res.send();

	} catch (err){

		res.status(400).send({ error: 'Erro ao recuperar senha, tente novamente'+err})

	}
});

module.exports = app => app.use('/auth', router);