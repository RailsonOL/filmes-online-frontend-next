import { responseErrorJson, responseJson } from '../../../utils'
import Serie from '../../../database/models/Serie'
import dbConnect from '../../../database/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    let char = ''
    let pag = 1

    if (req.query.params) {
      if (req.query.params.length === 2) {
        char = req.query.params[0]
        pag = req.query.params[1]
      } else if (!parseInt(req.query.params[0])) {
        char = req.query.params[0]
      } else {
        pag = req.query.params[0]
      }
    }

    const limiteItens = 12
    if (char !== '') {
      let paginaAtual = pag >= 1 ? pag : 1

      paginaAtual = paginaAtual - 1
      let totalPaginas

      await Serie.countDocuments({}, function (err, count) {
        if (err) throw err

        totalPaginas = Math.ceil(count / limiteItens)
      })

      await Serie.find({}, 'img titulo qualidade nota pagina ano trailer')
        .sort({ updatedAt: -1 })
        .limit(limiteItens)
        .skip(limiteItens * paginaAtual)
        .then((resultado) => {
          return responseJson(res, { total_pag: totalPaginas, resultado })
        })
    } else {
      let paginaAtual = pag >= 1 ? pag : 1

      paginaAtual = paginaAtual - 1
      let totalPaginas

      await Serie.countDocuments({ titulo: { $regex: '^' + char, $options: 'i' } }, function (err, count) {
        if (err) throw err

        totalPaginas = Math.ceil(count / limiteItens)
      })

      await Serie.find({ titulo: { $regex: '^' + char, $options: 'i' } }, 'img titulo qualidade nota pagina ano trailer')
        .sort({ updatedAt: -1 })
        .limit(limiteItens)
        .skip(limiteItens * paginaAtual)
        .then((resultado) => {
          return responseJson(res, { total_pag: totalPaginas, resultado })
        })
    }
  } catch (error) {
    return responseErrorJson(res, 'todos_as_series::get', error)
  }
}

export default get
