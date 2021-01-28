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
	status: {
		type: Number,
		default: 1
	},
	dataCriacao: {
        type: Date,
        default: Date.now(),
	},
})

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;