import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, validarImg, exibirTudo, atualizarPorDataSimples } from '../../utils/utils'
import AnimesEpRecentes from '../../models/AnimesEpRecentes'
import AnimesRecentes from '../../models/AnimesRecentes'

import dbConnect from '../../utils/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    const primeiro = await exibirTudo(AnimesEpRecentes, 1)

    if (atualizarPorDataSimples(primeiro)) { // As datas são diferentes, salvar
      const { data } = await axios.get('https://www.myanimesonline.biz/')
      const $ = cheerio.load(data)

      // await AnimesEpRecentes.countDocuments({}, async function (err, count) {
      //     if (count > 24) {
      //         await AnimesEpRecentes.deleteMany({})
      //         await AnimesRecentes.deleteMany({})
      //     }
      // })

      $('div.videos-row').find('ul.videos > li').each(async (i, e) => { // loop episodios recentes
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

      const animeseps = await exibirTudo(AnimesEpRecentes)
      const animes = await exibirTudo(AnimesRecentes)

      const resultado = { animeseps, animes }

      res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate')
      res.status(200)
      return res.json(resultado)
    } else {
      // console.log('As datas são iguais, não salvar');
      const animeseps = await exibirTudo(AnimesEpRecentes, 20)
      const animes = await exibirTudo(AnimesRecentes)

      const resultado = { animeseps, animes }

      res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate')
      res.status(200)
      return res.json(resultado)
    }
  } catch (error) {
    return responseErrorJson(res, 'animesrecentes::get', error)
  }
}

export default get
