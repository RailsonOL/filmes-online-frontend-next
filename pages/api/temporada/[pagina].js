import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, seExiste, validarImg, atualizarPorData, exibirEps } from '../../../utils'
import Temporada from '../../../database/models/Temporada'
import dbConnect from '../../../database/dbConnect'

const get = async (req, res) => {
  try {
    await dbConnect()
    const pagina = req.query.pagina
    const opt1 = await seExiste(Temporada, pagina)

    if (opt1) { // Serie ou filme já cadastrado
      const primeiroDaLista = await Temporada.findOne({ pagina: pagina })
      // console.log(primeiroDaLista)

      if (atualizarPorData(primeiroDaLista, 3)) { // Atualizar links e descrção a cada 5 dias se foi criado a menos de 3 meses e se for desse ano
        const response = await axios.get(`https://www.superflix.net/temporada/${pagina}`)
        const $ = cheerio.load(response.data)

        const episodios = []

        $('ul#episode_by_temp').find('li').each(function (index, elem) {
          const el = $(elem)
          const img = validarImg(el.find('figure > img').attr('src'))
          const numEp = el.find('span.num-epi').text()
          const nomeEp = el.find('h2.entry-title').text()
          const link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/', '')
          const data = el.find('span.time').text()

          episodios.push(`{"img": "${img}", "num_ep": "${numEp}", "nome_ep": "${nomeEp}", "link": "${link}", "data": "${data}"}`)
        })

        await Temporada.findOneAndUpdate({ pagina: pagina }, { episodios }, { upsert: true }, function (err, doc) {
          if (err) return res.send(500, { error: err })
          return console.log(`Episodios de ${pagina} atualizado`)
        })

        const exibir = await Temporada.findOne({ pagina: pagina })

        return responseJson(res, exibirEps(exibir))
      }

      const exibir = await Temporada.findOne({ pagina: pagina })

      return responseJson(res, exibirEps(exibir))
    } else { // Não encontrado, então capturar e cadastrar
      const response = await axios.get(`https://www.superflix.net/temporada/${pagina}`)
      const $ = cheerio.load(response.data)

      const episodios = []
      const temporada = $('button.btn.lnk.npd.aa-arrow-right').text()

      $('ul#episode_by_temp').find('li').each(function (index, elem) {
        const el = $(elem)
        const img = validarImg(el.find('figure > img').attr('src'))
        const numEp = el.find('span.num-epi').text()
        const nomeEp = el.find('h2.entry-title').text()
        const link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/', '')
        const data = el.find('span.time').text()

        episodios.push(`{"img": "${img}", "num_ep": "${numEp}", "nome_ep": "${nomeEp}", "link": "${link}", "data": "${data}"}`)
      })

      const addTemporada = new Temporada({
        temporada,
        episodios,
        pagina
      })

      await addTemporada.save()
        .then(() => {
          console.log('Nova temporada adicionado a DB')
        })
        .catch((err) => {
          console.log(err.code === 11000 ? 'Temporada duplicado' : err)
        })

      const exibir = await Temporada.findOne({ pagina: pagina })

      return responseJson(res, exibirEps(exibir))
    }
  } catch (error) {
    // console.log(error)
    return responseErrorJson(res, 'temporada::get', error)
  }
}

export default get
