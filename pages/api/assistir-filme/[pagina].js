import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, seExiste, validarImg, atualizarPorData, encodeDecode } from '../../../utils'
import Filme from '../../../database/models/Filme'
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

    const opt1 = await seExiste(Filme, pagina)
    
    if (opt1) { // Serie ou filme já cadastrado
      const primeiroDaLista = await Filme.findOne({ pagina: pagina })
      if (atualizarPorData(primeiroDaLista, 5) || forceUpdate) { // Atualizar links e descrção a cada 3 dias se foi criado a menos de 3 meses e se for desse ano
        const response = await axios.get(`https://superflix.vip/movies/${pagina}`)
        const $ = cheerio.load(response.data)
        const serie = $('section.section.episodes').find('ul#episode_by_temp').is('#episode_by_temp')
        const trailer = $('div#mdl-trailer').find('iframe').attr('src')
        const descricao = $('div.dfxb.alg-cr').find('div.description').text()
        const nota = $('div.vote-cn').find('span.vote').text()
        const links = []

          $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
            const el = $(e)
            let opcao = el.attr('id')
            const link = el.find('iframe').attr('data-lazy-src')

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

      const exibir = await Filme.findOne({ pagina: pagina })

      return responseJson(res, exibir)
    } else { // Não encontrado, então capturar e cadastrar
      const response = await axios.get(`https://superflix.vip/movies/${pagina}`)
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

        $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
          const el = $(e)
          let opcao = el.attr('id')
          const link = el.find('iframe').attr('data-lazy-src')

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

        res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate')
        res.status(200)
        return res.json(exibir)
    }
  } catch (error) {
    return responseErrorJson(res, 'assistir::get', error)
  }
}

export default get
