const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
	},
	senha: {
		type: String,
		required: true,
		select: false,
	},
	pessoa: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Pessoa',
	},
	projetos: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ItemProjetoUsuario',
		default: [],
	}],
	permissao: {
		type: Number,
		/* 1 - Paulo Passivo, 2 - Admin*/
	}
})

UsuarioSchema.pre('save', async function(next){
	const hash = await bcrypt.hash(this.senha, 10);
	this.senha = hash;
	next();
})

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;