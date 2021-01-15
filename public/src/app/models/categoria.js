const mongoose = require('../../database');

const CategoriaSchema = new mongoose.Schema({
	nome: {
		type: String,
		reuire: true,
	},
})

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;