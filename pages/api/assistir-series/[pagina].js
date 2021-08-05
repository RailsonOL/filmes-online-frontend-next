import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, hex2a, seExiste, validarImg, atualizarPorData, encodeDecode } from '../../../utils'
import Filme from '../../../database/models/Filme'
import Serie from '../../../database/models/Serie'
import dbConnect from '../../../database/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    let pagina = encodeDecode(req.query.pagina, 'decode', 'base64')
    const qualidade = 'HD'

    let forceUpdate = false
    if (pagina.includes('-update-now')) {
      forceUpdate = true
      pagina = pagina.replace('-update-now', '')
    }

    const opt2 = await seExiste(Serie, pagina)
    
    if (opt1) { // Serie ou filme já cadastrado
      const primeiroDaLista = await Serie.findOne({ pagina: pagina })
      if (atualizarPorData(primeiroDaLista, 5) || forceUpdate) { // Atualizar links e descrção a cada 3 dias se foi criado a menos de 3 meses e se for desse ano
        const response = await axios.get(`https://superflix.vip/series/${pagina}`)
        const $ = cheerio.load(response.data)

        const trailer = $('div#mdl-trailer').find('iframe').attr('src')
        const descricao = $('div.dfxb.alg-cr').find('div.description').text()
        const nota = $('div.vote-cn').find('span.vote').text()
        const links = []

          const temporadas = []
          $('div.aa-drp.choose-season').each((i, e) => {
            const el = $(e)
            const temp = el.text()
            const link = el.find('a').attr('href').replace('https://superflix.vip/', '')
            temporadas.push(`${temp}|${link}`)
          })

          Serie.findOneAndUpdate({ pagina: pagina }, { descricao, temporadas, qualidade, trailer, nota }, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err })
            return console.log('Succesfully saved.')
          })

          const exibir = await Serie.findOne({ pagina: pagina })

          return responseJson(res, exibir)
      }

      const exibir = await Serie.findOne({ pagina: pagina })

      return responseJson(res, exibir)
    } else { // Não encontrado, então capturar e cadastrar
      const response = await axios.get(`https://superflix.vip/series/${pagina}`)
      const $ = cheerio.load(response.data)

      const img = validarImg($('div.dfxb.alg-cr').find('figure > img').attr('src'))
      const titulo = $('div.dfxb.alg-cr').find('h1.entry-title').text()
      const trailer = $('div#mdl-trailer').find('iframe').attr('src')
      const duracao = $('div.dfxb.alg-cr').find('span.duration.fa-clock.far').text()
      const nota = $('div.vote-cn').find('span.vote').text()
      const categorias = []

      $('div.dfxb.alg-cr').find('span.genres > a').each((i, e) => {
        categorias.push($(e).text())
      })

      const ano = $('div.dfxb.alg-cr').find('span.year.fa-calendar.far').text()
      const descricao = $('div.dfxb.alg-cr').find('div.description').text()
      const links = []

        const temporadas = []
        $('div.aa-drp.choose-season').each(async (i, e) => {
          const el = $(e)
          const temp = el.text()
          const link = el.find('a').attr('href').replace('https://superflix.vip/', '')
          temporadas.push(`${temp}|${link}`)
        })

        const addSerie = new Serie({
          titulo,
          img,
          nota,
          descricao,
          trailer,
          temporadas,
          duracao,
          qualidade,
          ano,
          categorias,
          pagina
        })

        await addSerie.save()
          .then(() => {
            console.log('Nova serie adicionada a DB')
          })
          .catch((err) => {
            console.log(err)
            console.log(err.code === 11000 ? 'Serie duplicada' : err)
          })

        const exibir = await Serie.findOne({ pagina: pagina })

        return responseJson(res, exibir)
    }
  } catch (error) {
    return responseErrorJson(res, 'assistir::get', error)
  }
}

export default get
