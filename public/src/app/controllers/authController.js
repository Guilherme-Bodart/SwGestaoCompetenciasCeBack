const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfig = require('../../config/auth')
const User = require('../models/user')
const router = express.Router()

function generateToken( params = {} ) {
    return jwt.sign( params, authConfig.secret,{
        expiresIn: 86400,
    })
}


router.post('/register', async (req,res) => {
    var verif = 0
    var { email, password, name } = req.query
    if (email === undefined){
       email = req.body.email
       password = req.body.password
       name = req.body.name
       verif = 1
    }
    if(email === "" || email === undefined){
        return res.status(401).send({error: "Campo E-Mail vazio"})
    }
    else if(password === "" || password === undefined){
        return res.status(403).send({error: "Campo Senha vazio"})
    }
    else if(name === "" || name === undefined){
        return res.status(402).send({error: "Campo Nome vazio"})
    }

    try {
        if (await User.findOne({ email }))
            return res.status(404).send({error : 'Usuário já existe'})
        var user;
        if (verif){
            user = await User.create(req.body)
        }
        else{
            user = await User.create(req.query)
        }
        user.password = undefined

        return res.send({
            user,
            token : generateToken({ id: user.id }),
         })
    }

    catch (err) {
        return res.status(400).send({ error: 'Falha no registro'})
    }
})

router.post('/authenticate', async (req,res) => {
    var { email, password } = req.query
    if (email === undefined && password === undefined){
       email = req.body.email
       password = req.body.password
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(404).send("Usuário não encontrado");
  
    if (!await bcrypt.compare(password, user.password))
      return res.status(401).send({ error: 'Senha inválida' });
    
    
    user.password = undefined

    res.send({ 
        user,
        token : generateToken({ id: user.id }),
    });
    return res.status(200)
    
  });


router.get('/', async (req, res) => {
    try {
        const usuarios = await User.find({},{email:1}).sort('email')
        return res.send({ usuarios })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega os usuarios'})
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const usuarios = await User.findById(req.params.userId)
        return res.send({ usuarios })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em carrega os usuarios'})
    }
});



module.exports = app => app.use('/auth', router)