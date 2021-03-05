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
    const opt1 = await seExiste(Filme, pagina)
    const opt2 = await seExiste(Serie, pagina)

    const tipo = opt1 ? Filme : Serie
    if (opt1 || opt2) { // Serie ou filme já cadastrado
      const primeiroDaLista = await tipo.findOne({ pagina: pagina })

      let forceUpdate = false
      if (pagina.includes('-update-now')) {
        forceUpdate = true
        pagina = pagina.replace('-update-now', '')
      }

      if (atualizarPorData(primeiroDaLista, 5) || forceUpdate) { // Atualizar links e descrção a cada 3 dias se foi criado a menos de 3 meses e se for desse ano
        const response = await axios.get(`https://www.superflix.net/${pagina}`)
        const $ = cheerio.load(response.data)
        const serie = $('section.section.episodes').find('ul#episode_by_temp').is('#episode_by_temp')
        const trailer = $('div#mdl-trailer').find('iframe').attr('src')
        const descricao = $('div.dfxb.alg-cr').find('div.description').text()
        const nota = $('div.vote-cn').find('span.vote').text()
        const links = []

        if (serie) { // se for uma serie
          const temporadas = []
          $('div.aa-drp.choose-season').each((i, e) => {
            const el = $(e)
            const temp = el.text()
            const link = el.find('a').attr('href').replace('https://www.superflix.net/', '')
            temporadas.push(`${temp}|${link}`)
          })

          Serie.findOneAndUpdate({ pagina: pagina }, { descricao, temporadas, qualidade, trailer, nota }, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err })
            return console.log('Succesfully saved.')
          })

          const exibir = await Serie.findOne({ pagina: pagina })

          return responseJson(res, exibir)
        } else { // se for filme
          $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
            const el = $(e)
            let opcao = el.attr('id')
            const link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

            opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

            links.push(`${opcao}|${link}`)
          })

          Filme.findOneAndUpdate({ pagina: pagina }, { descricao, links, qualidade, trailer, nota }, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err })
            return console.log('Filme atualizado.')
          })

          const exibir = await Filme.findOne({ pagina: pagina })

          return responseJson(res, exibir)
        }
      }

      const exibir = await tipo.findOne({ pagina: pagina })

      return responseJson(res, exibir)
    } else { // Não encontrado, então capturar e cadastrar
      const response = await axios.get(`https://www.superflix.net/${pagina}`)
      const $ = cheerio.load(response.data)

      const serie = $('section.section.episodes').find('ul#episode_by_temp').is('#episode_by_temp')

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

      if (serie) { // se for uma serie
        const temporadas = []
        $('div.aa-drp.choose-season').each(async (i, e) => {
          const el = $(e)
          const temp = el.text()
          const link = el.find('a').attr('href').replace('https://www.superflix.net/', '')
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
      } else { // se for filme
        $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
          const el = $(e)
          let opcao = el.attr('id')
          const link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

          opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

          links.push(`${opcao}|${link}`)
        })

        const addFilme = new Filme({
          titulo,
          img,
          nota,
          links,
          trailer,
          descricao,
          duracao,
          categorias,
          ano,
          pagina
        })

        await addFilme.save()
          .then(() => {
            console.log('Novo filme adicionado a DB')
          })
          .catch((err) => {
            console.log(err.code === 11000 ? 'Filme duplicado' : err)
          })

        const exibir = await Filme.findOne({ pagina: pagina })

        return responseJson(res, exibir)
      }
    }
  } catch (error) {
    return responseErrorJson(res, 'assistir::get', error)
  }
}

export default get
