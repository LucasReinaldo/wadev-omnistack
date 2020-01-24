const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); //receber tanto as requisições http (front) quanto do websocket

const routes = require('./routes/routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);
setupWebsocket(server); //funcao vai ser disparada assim que a aplicacao inicializar.

let port = 3333 || process.env.PORT

const uri = "mongodb+srv://omnistack:omnistack@cluster0-raual.mongodb.net/week10?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors()); //Está liberando o acesso para todo tipo de aplicacao, ver como "origin: http..."
app.use(express.json());
/* Rotas: defini as rotas em um arquivo, exportei o módulo e importei no index.js,
após, utilizo o app.use para definir que serão utilizados as rotas em routes.
*/
app.use(routes);

/** start server */
server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});