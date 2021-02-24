import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, seExiste, exibirEps, validarImg, atualizarPorData } from '../../../utils/utils'
import Animes from '../../../models/Animes'
import dbConnect from '../../../utils/dbConnect'

const get = async (req, res) => {
    try {
        await dbConnect()

        let pagina = req.query.pagina

        let forceUpdate = false
        if (pagina.includes('-update-now')) {
            forceUpdate = true
            pagina = pagina.replace('-update-now', '')
        }

        let anime = await Animes.findOne({ 'pagina': pagina })

        let opt1 = await seExiste(Animes, pagina)
        if (opt1) { //Anime já cadastrado

            if (atualizarPorData(anime, 7) || forceUpdate) { // Atualizar links de eps a cada 7 dias

                const response = await axios.get(`https://www.myanimesonline.biz/animes/${pagina}`)
                let $ = cheerio.load(response.data)

                let episodios = []

                $('div.pagina-conteudo').find("ul.episodios > li").each((i, e) => { //loop episodios

                    let img = validarImg($(e).find("img").attr("src"))
                    let num_ep = $(e).find("span").text()
                    let nome_ep = $(e).find("h2").text()
                    let link = $(e).find("a").attr("href").replace("https://www.myanimesonline.biz/animes/", "")
                    let data = "--"
                    episodios.push(`{"img": "${img}", "num_ep": "${num_ep}", "nome_ep": "${nome_ep}", "link": "${link}", "data": "${data}"}`)

                })

                Animes.findOneAndUpdate({ 'pagina': pagina }, { episodios }, { upsert: true }, function (err, doc) {
                    if (err) return res.send(500, { error: err })
                    return console.log('Lista de Eps em Anime, atualizado.')
                })

                let exibir = await Animes.findOne({ 'pagina': pagina })

                return responseJson(res, exibirEps(exibir))
            }

            let exibir = await Animes.findOne({ 'pagina': pagina })

            return responseJson(res, exibirEps(exibir))

        } else { //Não encontrado, então capturar e cadastrar

            const response = await axios.get(`https://www.myanimesonline.biz/animes/${pagina}/`)
            let $ = cheerio.load(response.data)

            let postTexto = $('div.pagina-conteudo').find("div.post-texto")
            let img = validarImg(postTexto.find("div.post-capa > img").attr("src"))
            let titulo = postTexto.find("div.post-capa > img").attr("alt")
            let ano = ""
            let categorias = []
            let descricao = postTexto.find("p").eq(0).text()
            let episodios = []

            postTexto.find("ul.post-infos > li").each((i, e) => { // loop categorias

                switch ($(e).find("b").text()) {
                    case "Gêneros":
                        categorias = $(e).find("span").text().replace(/\s/g, '').split(",")
                        break;

                    case "Data de Lançamento":
                        ano = $(e).find("span").text()
                        break;
                }

            })

            $('div.pagina-conteudo').find("ul.episodios > li").each((i, e) => { //loop episodios

                let img = validarImg($(e).find("img").attr("src"))
                let num_ep = $(e).find("span").text()
                let nome_ep = $(e).find("h2").text()
                let link = $(e).find("a").attr("href").replace("https://www.myanimesonline.biz/animes/episodio/", "animeeps/")
                let data = "--"
                episodios.push(`{"img": "${img}", "num_ep": "${num_ep}", "nome_ep": "${nome_ep}", "link": "${link}", "data": "${data}"}`)

            })

            const addAnimeTemp = new Animes({
                titulo,
                img,
                episodios,
                ano,
                descricao,
                categorias,
                pagina,
            })

            await addAnimeTemp.save()
                .then(() => {
                    console.log('Nova temp de Anime adicionada a DB')
                })
                .catch((err) => {
                    console.log(err.code == 11000 ? 'Anime duplicado' : err)
                })

            let exibir = await Animes.findOne({ 'pagina': pagina })

            return responseJson(res, exibirEps(exibir))

        }

    } catch (error) {
        return responseErrorJson(res, 'anime::get', error)
    }
}

export default get