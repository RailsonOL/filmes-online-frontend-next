import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, hex2a} from '../../../utils/utils'
import Filme from '../../../models/Filme'
import Serie from '../../../models/Serie'
import dbConnect from '../../../utils/dbConnect'

const get = async (req, res) => {
    try {
        await dbConnect()

        let pagina = req.query.pagina
        let qualidade = 'HD'

        const response = await axios.get(`https://www.superflix.net/${pagina}`)
        let $ = cheerio.load(response.data)
        let serie = $('section.section.episodes').find('ul#episode_by_temp').is('#episode_by_temp')
        let trailer = $('div#mdl-trailer').find('iframe').attr('src')
        let descricao = $('div.dfxb.alg-cr').find('div.description').text()
        let nota = $('div.vote-cn').find('span.vote').text()
        let links = []

        if (serie) { //se for uma serie

            let temporadas = []
            $('div.aa-drp.choose-season').each((i, e) => {
                let el = $(e)
                let temp = el.text()
                let link = el.find('a').attr('href').replace('https://www.superflix.net/', '')
                temporadas.push(`${temp}|${link}`)
            })

            Serie.findOneAndUpdate({ 'pagina': pagina }, { descricao, links, qualidade, trailer, nota }, { upsert: true }, function (err, doc) {
                if (err) return res.send(500, { error: err })
                res.setHeader('Cache-Control', 's-maxage=800, stale-while-revalidate')
                res.status(200)
                return res.json({ 'status': 'Serie Atualizada' })
            })

        } else {  //se for filme

            $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
                let el = $(e)
                let opcao = el.attr('id')
                let link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

                opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

                links.push(`${opcao}|${link}`)
            })

            Filme.findOneAndUpdate({ 'pagina': pagina }, { descricao, links, qualidade, trailer, nota }, { upsert: true }, function (err, doc) {
                if (err) return res.send(500, { error: err })
                res.setHeader('Cache-Control', 's-maxage=800, stale-while-revalidate')
                res.status(200)
                return res.json({ 'status': 'Filme Atualizado' })
            })

        }

    } catch (error) {
        return responseErrorJson(res, 'update_pag::get', error)
    }
}

export default get