import { responseErrorJson, responseJson } from '../../../../utils/utils'
import collection from '../../../../models/dados'
import dbConnect from '../../../../utils/dbConnect'

const get = async (req, res) => {

  try {
    await dbConnect()

    let pesquisa = req.query.pesquisa
    //let pesquisa = req.query.pesquisa.includes(' ') ? req.query.pesquisa.replace(/\s/g,'|') : req.query.pesquisa

    let regex = new RegExp(pesquisa, 'i')  // 'i' deixa case sensitive

    let resultado = {
      total_pag: 0,
      resultado: []
    }

    let filme = []
    let serie = []

    const limiteItens = 12
    let paginaAtual = req.query.pag >= 1 ? req.query.pag : 1

    paginaAtual = paginaAtual - 1

    await collection.Filme.count({ titulo: regex }, function (err, count) {
      resultado.total_pag += count
    })

    await collection.Filme.find({ titulo: regex }, 'img titulo nota pagina ano')
      .sort({ 'updatedAt': -1 })
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        filme = result
        return
      })

    await collection.Serie.count({ titulo: regex }, function (err, count) {
      resultado.total_pag = resultado.total_pag > count ? Math.ceil(resultado.total_pag / limiteItens) : Math.ceil(count / limiteItens)
    })

    await collection.Serie.find({ titulo: regex }, 'img titulo nota qualidade pagina ano')
      .sort({ 'updatedAt': -1 })
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

export default get