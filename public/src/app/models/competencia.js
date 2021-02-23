const mongoose = require('../../database');

const CompetenciaSchema = new mongoose.Schema({
	usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
	item_usuario_projeto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemProjetoUsuario',
        required: true,
    },
    subcategoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubcCategoria',
    },
    nota: {
		type: Number,
	}
})

const Competencia = mongoose.model('Competencia', CompetenciaSchema);

module.exports = Competencia;