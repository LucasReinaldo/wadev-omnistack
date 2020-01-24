import socketio from 'socket.io-client'; //para o frontend, por isso o -client.

//usando o mesmo endereço pois precisa fazer as chamadas, conexoes com o axios.
const socket = socketio('http://localhost:3333', {
    autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {
    socket.io.opts.query = { latitude, longitude, techs }; //com isso eu envio essas informacoes para o backend
    socket.connect();
};

function disconnect() {
    if (socket.connect) {
        socket.disconnect();
    };
};

export { connect, disconnect, subscribeToNewDevs };