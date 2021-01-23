import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, hex2a, seExiste, validarImg, atualizarPorData } from '../../../utils/utils'
import Filme from '../../../models/Filme'
import Serie from '../../../models/Serie'
import dbConnect from '../../../utils/dbConnect'

const get = async (req, res) => {
    try {
        await dbConnect()
        
        let pagina = req.query.pagina

        let opt1 = await seExiste(Filme, pagina)
        let opt2 = await seExiste(Serie, pagina)

        let tipo = opt1 ? Filme : Serie

        if (opt1 == true || opt2 == true) { //Serie ou filme já cadastrado

            let primeiroDaLista = await tipo.findOne({ 'pagina': pagina })

            if (atualizarPorData(primeiroDaLista, 5)) { // Atualizar links e descrção a cada 5 dias se foi criado a menos de 3 meses e se for desse ano

                const response = await axios.get(`https://www.superflix.net/${pagina}`)
                let $ = cheerio.load(response.data)
                let serie = $('section.section.episodes').find('ul#episode_by_temp').is('#episode_by_temp')
                let descricao = $('div.dfxb.alg-cr').find('div.description').text()
                let links = []

                if (serie) { //se for uma serie

                    let temporadas = []
                    $('div.aa-drp.choose-season').each((i, e) => {
                        let el = $(e)
                        let temp = el.text()
                        let link = el.find('a').attr('href').replace('https://www.superflix.net/', '')
                        temporadas.push(`${temp}|${link}`)
                    })

                    Serie.findOneAndUpdate({ 'pagina': pagina }, { 'descricao': descricao, 'temporadas': temporadas }, { upsert: true }, function (err, doc) {
                        if (err) return res.send(500, { error: err })
                        return console.log('Succesfully saved.')
                    })

                    let exibir = await Serie.findOne({ 'pagina': pagina })

                    return responseJson(res, exibir)

                } else {  //se for filme

                    $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
                        let el = $(e)
                        let opcao = el.attr('id')
                        let link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

                        opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

                        links.push(`${opcao}|${link}`)
                    })

                    Filme.findOneAndUpdate({ 'pagina': pagina }, { 'descricao': descricao, 'links': links }, { upsert: true }, function (err, doc) {
                        if (err) return res.send(500, { error: err })
                        return console.log('Filme atualizado.')
                    })

                    let exibir = await Filme.findOne({ 'pagina': pagina })

                    return responseJson(res, exibir)
                }

            }

            let exibir = await tipo.findOne({ 'pagina': pagina })

            return responseJson(res, exibir)

        } else { //Não encontrado, então capturar e cadastrar

            const response = await axios.get(`https://www.superflix.net/${pagina}`)
            let $ = cheerio.load(response.data)

            let serie = $('section.section.episodes').find('ul#episode_by_temp').is('#episode_by_temp')

            let img = validarImg($('div.dfxb.alg-cr').find('figure > img').attr('src'))
            let titulo = $('div.dfxb.alg-cr').find('h1.entry-title').text()
            let duracao = $('div.dfxb.alg-cr').find('span.duration.fa-clock.far').text()
            let nota = $('div.vote-cn').find('span.vote').text()
            let categorias = []

            $('div.dfxb.alg-cr').find('span.genres > a').each((i, e) => {
                categorias.push($(e).text())
            })

            let ano = $('div.dfxb.alg-cr').find('span.year.fa-calendar.far').text()
            let descricao = $('div.dfxb.alg-cr').find('div.description').text()
            let links = []

            if (serie) { //se for uma serie

                let temporadas = []
                $('div.aa-drp.choose-season').each(async (i, e) => {
                    let el = $(e)
                    let temp = el.text()
                    let link = el.find('a').attr('href').replace('https://www.superflix.net/', '')
                    temporadas.push(`${temp}|${link}`)
                })

                const addSerie = new Serie({
                    titulo,
                    img,
                    nota,
                    descricao,
                    temporadas,
                    duracao,
                    ano,
                    categorias,
                    pagina
                })

                await addSerie.save()
                    .then(() => {
                        console.log('Nova serie adicionada a DB')
                    })
                    .catch((err) => {
                        console.log(err.code == 11000 ? 'Serie duplicada' : err)
                    })

                let exibir = await Serie.findOne({ 'pagina': pagina })

                return responseJson(res, exibir)

            } else {  //se for filme

                $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
                    let el = $(e)
                    let opcao = el.attr('id')
                    let link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

                    opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

                    links.push(`${opcao}|${link}`)
                })

                const addFilme = new Filme({
                    titulo,
                    img,
                    nota,
                    links,
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
                        console.log(err.code == 11000 ? 'Filme duplicado' : err)
                    })

                let exibir = await Filme.findOne({ 'pagina': pagina })

                return responseJson(res, exibir)
            }

        }

    } catch (error) {
        return responseErrorJson(res, 'assistir::get', error)
    }
}

export default get