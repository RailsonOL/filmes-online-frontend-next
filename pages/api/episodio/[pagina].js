import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, hex2a, seExiste, validarImg, atualizarPorData} from '../../../utils/utils'
import Epsodios from '../../../models/Epsodios'
import dbConnect from '../../../utils/dbConnect'

const get = async (req, res) => {

    try {
        await dbConnect()

        let pagina = req.query.pagina
        let episodio = await Epsodios.findOne({ 'pagina': pagina })

        let opt1 = await seExiste(Epsodios, pagina)

        if (opt1 == true) {//Serie ou filme já cadastrado

            if (atualizarPorData(episodio, 5)) { // Atualizar links e descrção a cada 5 dias se foi criado a menos de 3 meses e se for desse ano

                const response = await axios.get(`https://www.superflix.net/episodio/${pagina}`)
                let $ = cheerio.load(response.data)

                let descricao = $('div.dfxb.alg-cr').find('div.description').text()
                let links = []

                $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each((i, e) => {
                    let el = $(e)
                    let opcao = el.attr('id')
                    let link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

                    opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

                    links.push(`${opcao}|${link}`)
                })

                Epsodios.findOneAndUpdate({ 'pagina': pagina }, { 'descricao': descricao, 'links': links }, { upsert: true }, function (err, doc) {
                    if (err) return res.send(500, { error: err })
                    return console.log('Episodio atualizado.')
                })

                let exibir = await Epsodios.findOne({ 'pagina': pagina })

                return responseJson(res, exibir)
            }

            let exibir = await Epsodios.findOne({ 'pagina': pagina })

            return responseJson(res, exibir)

        } else {//Não encontrado, então capturar e cadastrar

            let pagina = req.query.pagina
            const response = await axios.get(`https://www.superflix.net/episodio/${pagina}`)
            let $ = cheerio.load(response.data)

            let img = validarImg($('div.dfxb.alg-cr').find('figure > img').attr('src'))
            let titulo = $('div.dfxb.alg-cr').find('h1.entry-title').text()
            let duracao = $('div.dfxb.alg-cr').find('span.duration.fa-clock.far').text()
            let ano = $('div.dfxb.alg-cr').find('span.year.fa-calendar.far').text()
            let descricao = $('div.dfxb.alg-cr').find('div.description').text()
            let links = []

            $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each(function (index, elem) {
                let el = $(elem)
                let opcao = el.attr('id')
                let link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')
                opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]
                links.push(`${opcao}|${link}`)
            })

            const addEpsodio = new Epsodios({
                titulo,
                img,
                duracao,
                ano,
                descricao,
                links,
                pagina
            })

            await addEpsodio.save()
                .then(() => {
                    console.log('Novo EP de serie adicionado a DB')
                })
                .catch((err) => {
                    console.log(err.code == 11000 ? 'EP duplicado' : err)
                })

            let exibir = await Epsodios.findOne({ 'pagina': pagina })

            return responseJson(res, exibir)

        }

    } catch (error) {

        return responseErrorJson(res, 'assistirep::get', error)

    }

}

export default get