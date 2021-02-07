import { responseErrorJson, responseJson, encodeDecode } from '../../../../utils/utils'
import Filme from '../../../../models/Filme'
import Serie from '../../../../models/Serie'
import dbConnect from '../../../../utils/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    let categoria = encodeDecode(req.query.categoria, 'decode', 'base64')

    let resultado = {
      total_pag: 0,
      resultado: []
    }

    let filme = []
    let serie = []

    const limiteItens = 12
    let paginaAtual = req.query.pag >= 1 ? req.query.pag : 1

    paginaAtual = paginaAtual - 1

    await Filme.countDocuments({ categorias: categoria }, function (err, count) {
      resultado.total_pag += count
    })

    await Filme.find({ categorias: categoria }, 'img titulo nota pagina ano')
      .sort({ 'updatedAt': -1 })
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        filme = result
        return
      })

    await Serie.countDocuments({ categorias: categoria }, function (err, count) {
      resultado.total_pag = resultado.total_pag > count ? Math.ceil(resultado.total_pag / limiteItens) : Math.ceil(count / limiteItens)
    })

    await Serie.find({ categorias: categoria }, 'img titulo nota pagina ano')
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