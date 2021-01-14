const mongoose = require('mongoose');
const URI_PRODUCAO = "mongodb+srv://outrigger:******@cluster0.rda29.gcp.mongodb.net/producao?retryWrites=true&w=majority"
const URI_TESTE = "mongodb+srv://outrigger:******@cluster0.rda29.gcp.mongodb.net/teste?retryWrites=true&w=majority"

mongoose.Promise = global.Promise;
mongoose.connect(URI_PRODUCAO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

module.exports = mongoose;
