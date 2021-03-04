const express = require('express');
const authMiddleware = require('../middlewares/auth');

const ItemProjetoUsuario = require('../models/itemProjetoUsuario');
const Competencia = require('../models/competencia');
const SubCategoria = require('../models/subcategoria');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {

        var { item_usuario_projeto, subcategoria, nota } = req.query
        if (item_usuario_projeto === undefined || subcategoria === undefined){
          var { item_usuario_projeto, subcategoria, nota } = req.body
        }

        if(await SubCategoria.findById(subcategoria) && await ItemProjetoUsuario.findById(item_usuario_projeto)){
            
            const existe_competencia = await Competencia.findOne({item_usuario_projeto: item_usuario_projeto, subcategoria: subcategoria})
            if(!existe_competencia){
                
                const competencia = await Competencia.create({ usuario: req.usuarioId, item_usuario_projeto, subcategoria, nota })
                
                await competencia.save()

                return res.send({ competencia })
            
            }else{

                const competencia = await Competencia.findByIdAndUpdate(existe_competencia._id)

                competencia.nota = nota;

                await competencia.save()

                return res.send({ competencia })

            }

        }else{

            return res.status(400).send({ error: 'Erro em criar a competencia'+err})

        }

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar a competencia'+err})
    }
});

module.exports = app => app.use('/competencias', router);