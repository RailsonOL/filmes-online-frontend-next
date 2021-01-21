const { responseErrorJson, responseJson } = require('../utils');
const collection = require('../models/dados')

const get = async (req, res) => {
    try {
            const limiteItens = 12
            if (!req.params.char) {
              
              let paginaAtual = req.params.pag >= 1 ? req.params.pag : 1
          
              paginaAtual = paginaAtual - 1 
              let totalPaginas
  
              await collection.Serie.countDocuments({}, function (err, count) {
                  totalPaginas = Math.ceil(count / limiteItens)
                })
  
              await collection.Serie.find({}, 'img titulo qualidade nota pagina ano')
                .sort({'updatedAt': -1})
                .limit(limiteItens)
                .skip(limiteItens * paginaAtual)
                .then((resultado) => {
                  return responseJson(res, {'total_pag': totalPaginas, resultado})
                })

            } else {
                
            var char = req.params.char
            let paginaAtual = req.params.pag >= 1 ? req.params.pag : 1
        
            paginaAtual = paginaAtual - 1 
            let totalPaginas

            await collection.Serie.countDocuments({"titulo": {$regex: '^' + char, $options: 'i'}}, function (err, count) {
                totalPaginas = Math.ceil(count / limiteItens)
              })

            await collection.Serie.find({"titulo": {$regex: '^' + char, $options: 'i'}}, 'img titulo qualidade nota pagina ano')
              .sort({'updatedAt': -1})
              .limit(limiteItens)
              .skip(limiteItens * paginaAtual)
              .then((resultado) => {
                return responseJson(res, {'total_pag': totalPaginas, resultado})
              })
            }

    } catch (error) {
        return responseErrorJson(res, `todos_os_filmes::get`, error)
    }
}

module.exports = {
    get
}