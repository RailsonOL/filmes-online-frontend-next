const { responseErrorJson, responseJson } = require('../utils');
const collection = require('../models/dados')

const get = async (req, res) => {

    try {

        let pesquisa = req.params.pesquisa
        //let pesquisa = req.params.pesquisa.includes(' ') ? req.params.pesquisa.replace(/\s/g,'|') : req.params.pesquisa

        let regex = new RegExp(pesquisa, 'i')  // 'i' deixa case sensitive

        let resultado = {
            total_pag: 0,
            resultado: []
        }

        let filme = []
        let serie = []

        const limiteItens = 12
        let paginaAtual = req.params.pag >= 1 ? req.params.pag : 1
      
        paginaAtual = paginaAtual - 1

        await collection.Filme.count({titulo: regex}, function (err, count) {
            resultado.total_pag += count
          })

        await collection.Filme.find({titulo: regex}, 'img titulo nota pagina ano')
          .sort({'updatedAt': -1})
          .limit(limiteItens)
          .skip(limiteItens * paginaAtual)
          .then((result) => {
            filme = result
            return
          })

        await collection.Serie.count({titulo: regex}, function (err, count) {
            resultado.total_pag = resultado.total_pag > count ? Math.ceil(resultado.total_pag / limiteItens) : Math.ceil(count / limiteItens)
          })

        await collection.Serie.find({titulo: regex}, 'img titulo nota qualidade pagina ano')
          .sort({'updatedAt': -1})
          .limit(limiteItens)
          .skip(limiteItens * paginaAtual)
          .then((result) => {
            serie = result
            return
          })

        resultado.resultado = filme.concat(serie)
        
        return responseJson(res, resultado)

    } catch (error) {
        return responseErrorJson(res, 'pesquisar::get', error)
    }
}

module.exports = {
    get
}
