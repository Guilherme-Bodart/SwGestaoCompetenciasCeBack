const express = require('express');
const authMiddleware = require('../middlewares/auth');

const ItemProjetoUsuario = require('../models/itemProjetoUsuario');
const Competencia = require('../models/competencia');
const SubCategoria = require('../models/subcategoria');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {

        var { projeto, membro, subcategoria, nota } = req.query
        if (projeto === undefined || subcategoria === undefined){
          var { projeto, membro, subcategoria, nota } = req.body
        }

        const item_projeto_usuario = await ItemProjetoUsuario.findOne({usuario: membro, projeto: projeto})
        if(item_projeto_usuario){
            if(await SubCategoria.findById(subcategoria) && await ItemProjetoUsuario.findById(item_projeto_usuario._id)){
                
                const existe_competencia = await Competencia.findOne({item_usuario_projeto: item_projeto_usuario._id, subcategoria: subcategoria})
                if(!existe_competencia){
                    
                    const competencia = await Competencia.create({ usuario: req.usuarioId, item_usuario_projeto: item_projeto_usuario._id, subcategoria, nota })
                    
                    await competencia.save()

                    return res.send({ competencia })
                
                }else{

                    const competencia = await Competencia.findByIdAndUpdate(existe_competencia._id)

                    competencia.nota = nota;

                    await competencia.save()

                    return res.send({ competencia })

                }

            }else{

                return res.status(400).send({ error: 'Erro em criar a competencia'})

            }
        }else{
            return res.status(400).send({ error: 'Erro em criar a competencia - membro nao encontrado'})
        }

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar a competencia'})
    }
});

module.exports = app => app.use('/competencias', router);