const mongoose = require('../../database');

const CategoriaSchema = new mongoose.Schema({
	usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
	nome: {
		type: String,
		reuire: true,
	},
})

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;