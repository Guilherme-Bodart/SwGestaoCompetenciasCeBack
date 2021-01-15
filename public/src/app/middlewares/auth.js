const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')


module.exports = (req, res, next) => {
    var authHeader
    if(req.headers.authorization){
        authHeader = req.headers.authorization
    }
    else {
        authHeader = req.query.token
    }
    if (!authHeader){
        return res.status(401).send({ error: 'Token não foi informado'})
    }
    
    const parts = authHeader.split(' ')

    if(!parts.length === 2){
        return res.status(401).send({ error: 'Token erro'})
    }
    
    const [ scheme, token ] = parts

    if (!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Token mal formato'})
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: "Token Inválido"})
        req.userId = decoded.id
        return next()
    })
}