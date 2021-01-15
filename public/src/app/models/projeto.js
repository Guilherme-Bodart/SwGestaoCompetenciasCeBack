const mongoose = require('../../database');

const ProjetoSchema = new mongoose.Schema({
	nome: {
        type: String,
        reuire: true,
    },
    usuarioCriacao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true,
    },
	equipe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: []
    }],
    dataCriacao: {
        type: Date,
        default: Date.now(),
	},
	descricao: {
        type: String,
        require: true,
    },
    atividades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Atividade',
        require: true,
        default:[]
    }],
})

const Projeto = mongoose.model('Projeto', ProjetoSchema);

module.exports = Projeto;