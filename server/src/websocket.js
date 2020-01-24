const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

const connections = []; //salvar as informacoes recebidas, apenas para teste, fazer conexao com banco de dados depois para ter todas essas infos salvas.

let io; //para ser usada por outros metodos

//mesmo que fazer function setupWebsocket e depois export, setupWebsocket é o nome da função e server é o mesmo do index.js.
exports.setupWebsocket = (server) => {
    //ou seja, estou atribuindo a conexao à variável io, entao toda vez que um usuário realizar uma conexao
    //o backend ouve atraves do eventListener 'connection' em io.on, e realiza algo.
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query; //recebe as infos do front

        connections.push({
            id: socket.id,
            coords: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs), //estou recebendo em forma de texto e transformando em array
        });
    });
};

/* estou exportando a funcao findConnection criada, recebendo como parametros as coordenadas e techs,
retornando um filtro com todas as conexoes e dentro dessas conexoes ele retorna através do cálculo naval para medir a distancia entre dois pontos
no arquivo calculateDistance, recebendo as coordenadas do novo dev cadastrado e as coordenadas armazenadas na conexao && se o novo
dev cadastrado possui pelo menos uma das tecnologias filtradas, por isso crio uma funcao item recebendo as technologias e passando como parametro, 
no final ele entende que: buscou por reactJS e salvou na memoria, se ele tem pelo menos uma das techs e esta em 10km, mostra ele. */
exports.findConnection = (coords, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coords, connection.coords) < 10
        && connection.techs.some(item => techs.includes(item));
    })
}

exports.sendMessageTo = (to, message, data) => {
    to.forEach(connection => { //forEach pois é um objeto e ele precisa percorrer todo o objeto encontrando as condicoes que satisfizeram a busca
        io.to(connection.id).emit(message, data) //connection.id é o socket.id, cada conexao é unica
    })
}