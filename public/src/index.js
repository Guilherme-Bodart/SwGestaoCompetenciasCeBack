const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

require('./app/controllers/index')(app)


let porta = process.env.PORT;
if (porta == null || porta == "") {
  porta = 3001;
}
app.listen(porta, () => console.log("listen on "+ JSON.stringify(porta)));