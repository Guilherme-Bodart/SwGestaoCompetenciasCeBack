const mongoose = require('mongoose');

const URI_PRODUCAO = "mongodb+srv://leds_skills:leds.skills123@ledsskills.bsizx.mongodb.net/producao?retryWrites=true&w=majority"
const URI_TESTE = "mongodb+srv://leds_skills:leds.skills123@ledsskills.bsizx.mongodb.net/teste?retryWrites=true&w=majority"

mongoose.connect(URI_TESTE, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

module.exports = mongoose;