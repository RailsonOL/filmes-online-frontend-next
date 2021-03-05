import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, validarImg, exibirTudo, deleteAllAfter } from '../../utils'
import AnimesEpRecentes from '../../database/models/AnimesEpRecentes'
import AnimesRecentes from '../../database/models/AnimesRecentes'

import dbConnect from '../../database/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    const { data } = await axios.get('https://www.myanimesonline.biz/')
    const $ = cheerio.load(data)

    await deleteAllAfter(AnimesEpRecentes, 13)
    await deleteAllAfter(AnimesRecentes, 13)

    $('div.videos-row').find('ul.videos > li').each(async (i, e) => { // loop episodios recentes
      if (i > 24) return

      const pagina = $(e).find('a').attr('href').replace('https://www.myanimesonline.biz/animes/episodio/', '').replace('/', '') + '-watch-now'
      const titulo = $(e).find('a').attr('title')
      const img = validarImg($(e).find('img').attr('src'))
      const qualidade = $(e).find('span.selo-ep').text()

      const addAnimeEpRecente = new AnimesEpRecentes({
        titulo,
        img,
        pagina,
        qualidade
      })

      await addAnimeEpRecente.save().catch((err) => {
        console.log(err.code === 11000 ? 'AnimeEP recente duplicado' : err)
      })
    })

    $('ul.widget-recentes').find('li').each(async (i, e) => { // loop animes recem adicionados
      const pagina = $(e).find('a').attr('href').replace('https://www.myanimesonline.biz/animes/', '')
      const titulo = $(e).find('a').attr('title')
      const img = validarImg($(e).find('img').attr('src'))
      const qualidade = 'HD'

      const addAnimeEpRecente = new AnimesRecentes({
        titulo,
        img,
        pagina,
        qualidade
      })

      await addAnimeEpRecente.save().catch((err) => {
        console.log(err.code === 11000 ? 'Anime recente duplicado' : err)
      })
    })

    const animeseps = await AnimesEpRecentes.find().limit(24).sort({ updatedAt: -1 })
      .then((result) => {
        return result
      })
      .catch((err) => {
        throw err
      })

    const animes = await exibirTudo(AnimesRecentes)

    const resultado = { animeseps, animes }

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate')
    res.status(200)
    return res.json(resultado)
  } catch (error) {
    return responseErrorJson(res, 'animesrecentes::get', error)
  }
}

export default get
