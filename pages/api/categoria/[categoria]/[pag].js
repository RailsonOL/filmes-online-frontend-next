import { responseErrorJson, responseJson, encodeDecode } from '../../../../utils'
import Filme from '../../../../database/models/Filme'
import Serie from '../../../../database/models/Serie'
import dbConnect from '../../../../database/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    const categoria = encodeDecode(req.query.categoria, 'decode', 'base64')

    const resultado = {
      total_pag: 0,
      resultado: []
    }

    let filme = []
    let serie = []

    const limiteItens = 12
    let paginaAtual = req.query.pag >= 1 ? req.query.pag : 1

    paginaAtual = paginaAtual - 1

    await Filme.countDocuments({ categorias: categoria }, function (err, count) {
      if (err) throw err

      resultado.total_pag += count
    })

    await Filme.find({ categorias: categoria }, 'img titulo nota pagina ano')
      .sort({ updatedAt: -1 })
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        filme = result
      })

    await Serie.countDocuments({ categorias: categoria }, function (err, count) {
      if (err) throw err

      resultado.total_pag = resultado.total_pag > count ? Math.ceil(resultado.total_pag / limiteItens) : Math.ceil(count / limiteItens)
    })

    await Serie.find({ categorias: categoria }, 'img titulo nota pagina ano')
      .sort({ updatedAt: -1 })
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        serie = result
      })

    resultado.resultado = filme.concat(serie)

    return responseJson(res, resultado)
  } catch (error) {
    return responseErrorJson(res, 'pesquisar::get', error)
  }
}

export default get
