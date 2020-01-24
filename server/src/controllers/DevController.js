const axios = require('axios');
const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnection, sendMessageTo } = require('../websocket');

//index(mostrar todos), show(mostrar um), store(criar), update, destroy.
module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

//Cria a função assíncrona, colocando o async e na resposta o await para que aguarde a resposta antes
//de passar para a próxima linha ou passos do código.
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
        
        //declarado como let para que seja possível reescrever o valor, evitando duplicar.
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            //se o nome não existir, trazer o login do usuário no lugar do nome.
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            //cria uma variável techArray que recebe as tecnologias divididas por ',', e o map
            //percorre o array removendo espaços antes e depois do array com o trim.
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            
            //nao precisa declarar a variavel novamente, pois estará criando um novo.
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            //Filtrar as conexoes que satisfacam as condicoes, que sao no maximo 10km de distancia do ponto atual e uma das tecnologias filtradas
            const sendSocketMessageTo = findConnection(
                { latitude, longitude },
                techsArray,
            );
            //criei um metodo para envio das infos (sendMessageTo) que percorre todos os devs e envia as mensagens,
            //sendo disparado sempre que um novo dev é criado e enviando
            sendMessageTo(sendSocketMessageTo, 'new-dev', dev); //agora o front tem que escutar a mensagem 'new-dev' e receber os dados dev, que sao
            //as mesmas informacoes do dev.create.
        }

        return res.json(dev);
    },

    async destroy(req, res) {
        await Dev.findByIdAndDelete(req.params.id);
        const devs = await Dev.find();

        return res.json(devs);
        // return res.send();
    }
};