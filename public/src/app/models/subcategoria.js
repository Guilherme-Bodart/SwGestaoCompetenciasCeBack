const mongoose = require('../../database');

const SubCategoriaSchema = new mongoose.Schema({
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