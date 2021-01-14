const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Technology = require('../models/technology');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {

        const technology = await Technology.find();

        return res.send({ technology })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carregar as tecnologias' })
    }
});

router.get('/:technologyId', async (req, res) => {
    try {

        const technology = await Technology.findById(req.params.technologytId);

        return res.send({ technology })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega a tecnologia' })
    }
});

router.post('/', async (req, res) => {
    try {

        const { title, description, category, subCategory, nTasks} = req.body

        const technology = await Technology.create({ title, description, category, subCategory, nTasks })

        await technology.save()
        return res.send({ technology })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar nova tecnologia' })
    }
});

router.put('/:technologyId', async (req, res) => {
    try {

        const { title, description, category, subCategory, nTasks } = req.body

        const technology = await Technology.findByIdAndUpdate(req.params.technologyId,
            {   title, 
                description, 
                category, 
                subCategory, 
                nTasks}, { new: true })

        await technology.save()
        return res.send({ technology })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em atualizar a tecnologia' })
    }
});

router.delete('/:technologyId', async (req, res) => {
    try {
        await Technology.findByIdAndDelete(req.params.technologyId);

        return res.send({})

    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar a tecnologia' })
    }
});

module.exports = app => app.use('/technologys', router);
