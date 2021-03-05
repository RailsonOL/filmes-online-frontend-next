import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, validarImg, exibirTudo, atualizarPorDataSimples, deleteAllAfter } from '../../utils'
import FilmesRecentes from '../../database/models/FilmesRecentes'
import FilmesDestaque from '../../database/models/FilmesDestaque'
import SeriesRecentes from '../../database/models/SeriesRecentes'
import dbConnect from '../../database/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    const primeiro = await exibirTudo(FilmesRecentes, 1)

    if (atualizarPorDataSimples(primeiro)) {
      // console.log('As datas são diferentes, salvar')
      const response = await axios.get('https://www.superflix.net/')
      const $ = cheerio.load(response.data)

      await deleteAllAfter(FilmesRecentes, 13)
      await deleteAllAfter(FilmesDestaque, 13)
      await deleteAllAfter(SeriesRecentes, 13)

      $('div#widget_list_movies_series-3-all.aa-tb.hdd.on').find('ul > li').each(async (i, elem) => { // Filmes Recentes
        const el = $(elem)
        const img = validarImg(el.find('figure > img').attr('src'))
        const titulo = el.find('h2.entry-title').text()
        const nota = el.find('span.vote').text()
        const pagina = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/', '')
        const qualidade = el.find('.Qlty').text()
        const ano = el.find('.year').text()

        const addFilme = new FilmesRecentes({
          img,
          titulo,
          nota,
          pagina,
          qualidade,
          ano
        })

        await addFilme.save().catch((err) => {
          console.log(err.code === 11000 ? 'Filme duplicado' : err)
        })
      })

      $('div#torofilm_wdgt_popular-3-all').find('ul > li').each(async (i, elem) => { // Filmes em Destaque
        const el = $(elem)
        const img = validarImg(el.find('figure > img').attr('src'))
        const titulo = el.find('h2.entry-title').text()
        const nota = el.find('span.vote').text()
        const pagina = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/', '')
        const duracao = el.find('span.time').text()
        const ano = el.find('span.year').text()

        const addFilme = new FilmesDestaque({
          titulo,
          img,
          nota,
          pagina,
          duracao,
          ano
        })

        await addFilme.save().catch((err) => {
          console.log(err.code === 11000 ? 'Destaque duplicado' : err)
        })
      })

      $('div#widget_list_movies_series-4-aa-movies').find('ul > li').each(async (i, elem) => { // Series Recentes
        const el = $(elem)

        if (el.find('a.lnk-blk').attr('href') === undefined) {
          console.log(el.text())
        }

        const img = validarImg(el.find('figure > img').attr('src'))
        const titulo = el.find('h2.entry-title').text()
        const nota = el.find('span.vote').text()
        const pagina = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/', '')
        const qualidade = el.find('.Qlty').text()
        const ano = el.find('.year').text()

        const addSerie = new SeriesRecentes({
          titulo,
          img,
          nota,
          pagina,
          qualidade,
          ano
        })

        await addSerie.save().catch((err) => {
          console.log(err.code === 11000 ? 'Serie duplicada' : err)
        })
      })

      const filmesRecentes = await exibirTudo(FilmesRecentes)
      const filmesDestaques = await exibirTudo(FilmesDestaque)
      const seriesRecentes = await exibirTudo(SeriesRecentes)

      const resultado = { filmes_recentes: filmesRecentes, filmes_destaques: filmesDestaques, series_recentes: seriesRecentes }

      return responseJson(res, resultado)
    } else {
      // console.log('As datas são iguais, não salvar');
      const filmesRecentes = await exibirTudo(FilmesRecentes)
      const filmesDestaques = await exibirTudo(FilmesDestaque)
      const seriesRecentes = await exibirTudo(SeriesRecentes)

      const resultado = { filmes_recentes: filmesRecentes, filmes_destaques: filmesDestaques, series_recentes: seriesRecentes }

      return responseJson(res, resultado)
    }
  } catch (error) {
    return responseErrorJson(res, 'recentes::get', error)
  }
}

export default get
