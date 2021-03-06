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
    entregas: [{
        type: Date,
        require: true,
        default:[]
    }],
    status: {
        type: Number,
		default: 1
    },
    dataDesativado: {
        type: Date,
	},
    competencias: {
        type: Object,
        default:{}
    },
    categorias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        default:[]
    }],
    subcategorias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategoria',
        default:[]
    }],
})

const Projeto = mongoose.model('Projeto', ProjetoSchema);

module.exports = Projeto;