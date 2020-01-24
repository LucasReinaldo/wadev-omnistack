const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')

//Buscar todos os devs num raio de 10km.
module.exports = {
    async index(req, res) {
        const { latitude, longitude, techs } = req.query;

        const techArray = parseStringAsArray(techs); //utilizando pois foi isolada evitando repetição.

        //criando uma variável devs que vai receber a busca por devs,
        //a busca será realizada através das techs que estão separadas no array e 
        //pela latitude e longitude se acordo com o ponto no mapa com distância máxima de 10km.
        //no final eu retorno a variavel devs em tela trazendo todos os resultado encontrados.
        const devs = await Dev.find({
            techs: {
                $in: techArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return res.json({ devs });
    }
}