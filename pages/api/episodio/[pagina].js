import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, hex2a, seExiste, validarImg, atualizarPorData } from '../../../utils/utils'
import Epsodios from '../../../models/Epsodios'
import dbConnect from '../../../utils/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()

    const pagina = req.query.pagina
    const episodio = await Epsodios.findOne({ pagina: pagina })
    const qualidade = 'HD'

    const opt1 = await seExiste(Epsodios, pagina)

    if (opt1 === true) { // Serie ou filme já cadastrado
      if (atualizarPorData(episodio, 5)) { // Atualizar links e descrção a cada 5 dias se foi criado a menos de 3 meses e se for desse ano
        const response = await axios.get(`https://www.superflix.net/episodio/${encodeURIComponent(pagina)}`)
        const $ = cheerio.load(response.data)

        const descricao = $('div.dfxb.alg-cr').find('div.description').text()
        const links = []

        $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
          const el = $(e)
          let opcao = el.attr('id')
          const link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

          opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

          links.push(`${opcao}|${link}`)
        })

        Epsodios.findOneAndUpdate({ pagina: pagina }, { qualidade, descricao, links }, { upsert: true }, function (err, doc) {
          if (err) return res.send(500, { error: err })
          return console.log('Episodio atualizado.')
        })

        const exibir = await Epsodios.findOne({ pagina: pagina })

        return responseJson(res, exibir)
      }

      const exibir = await Epsodios.findOne({ pagina: pagina })

      return responseJson(res, exibir)
    } else { // Não encontrado, então capturar e cadastrar
      const pagina = req.query.pagina
      const response = await axios.get(`https://www.superflix.net/episodio/${encodeURIComponent(pagina)}`)
      const $ = cheerio.load(response.data)

      const img = validarImg($('div.dfxb.alg-cr').find('figure > img').attr('src'))
      const titulo = $('div.dfxb.alg-cr').find('h1.entry-title').text()
      const duracao = $('div.dfxb.alg-cr').find('span.duration.fa-clock.far').text()
      const ano = $('div.dfxb.alg-cr').find('span.year.fa-calendar.far').text()
      const descricao = $('div.dfxb.alg-cr').find('div.description').text()
      const links = []

      $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each(function (index, elem) {
        const el = $(elem)
        let opcao = el.attr('id')
        const link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')
        opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]
        links.push(`${opcao}|${link}`)
      })

      const addEpsodio = new Epsodios({
        titulo,
        img,
        duracao,
        ano,
        descricao,
        qualidade,
        links,
        pagina
      })

      await addEpsodio.save()
        .then(() => {
          console.log('Novo EP de serie adicionado a DB')
        })
        .catch((err) => {
          console.log(err.code === 11000 ? 'EP duplicado' : err)
        })

      const exibir = await Epsodios.findOne({ pagina: pagina })

      return responseJson(res, exibir)
    }
  } catch (error) {
    return responseErrorJson(res, 'assistirep::get', error)
  }
}

export default get
