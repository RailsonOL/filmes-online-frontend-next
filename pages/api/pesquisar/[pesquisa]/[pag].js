import { responseErrorJson, responseJson } from '../../../../utils'
import Filme from '../../../../database/models/Filme'
import Serie from '../../../../database/models/Serie'
import Anime from '../../../../database/models/Animes'
import dbConnect from '../../../../database/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    const pesquisa = req.query.pesquisa
    const regex = new RegExp(pesquisa, 'i') // 'i' deixa case sensitive

    const resultado = {
      total_pag: 0,
      resultado: []
    }

    let filme = []
    let serie = []
    let anime = []

    const limiteItens = 12
    let paginaAtual = req.query.pag >= 1 ? req.query.pag : 1

    paginaAtual = paginaAtual - 1

    await Filme.countDocuments({ $or: [{ titulo: regex }, { pagina: regex }, { descricao: regex }] }, function (err, count) {
      if (err) throw err

      resultado.total_pag += count
    })

    await Filme.find({ $or: [{ titulo: regex }, { pagina: regex }, { descricao: regex }] }, 'img titulo nota qualidade pagina ano')
      .sort({ updatedAt: -1 })
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        filme = result
      })

    await Serie.countDocuments({ $or: [{ titulo: regex }, { pagina: regex }, { descricao: regex }] }, function (err, count) {
      if (err) throw err

      resultado.total_pag = resultado.total_pag > count ? Math.ceil(resultado.total_pag / limiteItens) : Math.ceil(count / limiteItens)
    })

    await Serie.find({ $or: [{ titulo: regex }, { pagina: regex }, { descricao: regex }] }, 'img titulo nota qualidade pagina ano')
      .sort({ updatedAt: -1 })
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        serie = result
      })

    await Anime.countDocuments({ $or: [{ titulo: regex }, { pagina: regex }, { descricao: regex }] }, function (err, count) {
      if (err) throw err

      resultado.total_pag = resultado.total_pag > count ? Math.ceil(resultado.total_pag / limiteItens) : Math.ceil(count / limiteItens)
    })

    await Anime.find({ $or: [{ titulo: regex }, { pagina: regex }, { descricao: regex }] }, 'img titulo nota qualidade pagina ano tipo')
      .sort({ updatedAt: -1 })
      .limit(limiteItens)
      .skip(limiteItens * paginaAtual)
      .then((result) => {
        anime = result
      })

    resultado.resultado = filme.concat(serie, anime)

    return responseJson(res, resultado)
  } catch (error) {
    return responseErrorJson(res, 'pesquisar::get', error)
  }
}

export default get
