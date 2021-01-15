const mongoose = require('../../database');

const SubCategoriaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
    },
	nome: {
		type: String,
		reuire: true,
	},
})

const SubCategoria = mongoose.model('SubCategoria', SubCategoriaSchema);

module.exports = SubCategoria;