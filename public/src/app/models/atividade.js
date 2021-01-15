const mongoose = require('../../database');

const AtividadeSchema = new mongoose.Schema({
	usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    titulo: {
        type: String,
    },
	descricao: {
        type: String,
    },
    dataInicial: {
        type: Date,
    },
    dataFinal: {
        type: Date,
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
    },
    subcategoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategoria',
    }
})

const Atividade = mongoose.model('Atividade', AtividadeSchema);

module.exports = Atividade;