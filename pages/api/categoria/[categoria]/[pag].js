import { responseErrorJson, responseJson } from '../../../../utils/utils'
import collection from '../../../../models/dados'
import dbConnect from '../../../../utils/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    let categoria = req.query.categoria

    let resultado = {
      total_pag: 0,
      resultado: []
    }

    let filme = []
    let serie = []

    const limiteItens = 12
    let paginaAtual = req.query.pag >= 1 ? req.query.pag : 1

    paginaAtual = paginaAtual - 1

    await collection.Filme.countDocuments({ categorias: categoria }, function (err, count) {
      resultado.total_pag += count
    })

    await collection.Filme.find({ categorias: categoria }, 'img titulo nota pagina ano')
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        filme = result
        return
      })

    await collection.Serie.countDocuments({ categorias: categoria }, function (err, count) {
      resultado.total_pag = resultado.total_pag > count ? Math.ceil(resultado.total_pag / limiteItens) : Math.ceil(count / limiteItens)
    })

    await collection.Serie.find({ categorias: categoria }, 'img titulo nota pagina ano')
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