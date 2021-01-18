const mongoose = require('../../database');

const ItemProjetoUsuarioSchema = new mongoose.Schema({
	projeto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projeto',
		required: true,
	},
	usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
		required: true,
	}
})

const ItemProjetoUsuario = mongoose.model('ItemProjetoUsuario', ItemProjetoUsuarioSchema);

module.exports = ItemProjetoUsuario;