const mongoose = require('../../database');

const PessoaSchema = new mongoose.Schema({
	nome: {
		type: String,
		reuire: true,
	},
	dataNascimento: {
		type: Date,
	},
	cpf: {
		type: String,
		unique: true,
		required: true,
	},
	endereco: {
		type: String,
	},
	telefone: {
		type: String,
	},
})

const Pessoa = mongoose.model('Pessoa', PessoaSchema);

module.exports = Pessoa;