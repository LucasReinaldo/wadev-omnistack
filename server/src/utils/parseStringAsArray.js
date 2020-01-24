
//criada a função levando a metologia DRY (don't repeat yourself), 
//como a mesma função ia ser utilizada em DevController e em SearchController,
//a função foi isolada e exportada para que evitar repeticao de código e manutenabilidade futuras. 
module.exports = function parseStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.trim())
}