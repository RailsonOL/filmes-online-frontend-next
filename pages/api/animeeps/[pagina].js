import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, seExiste, validarImg} from '../../../utils/utils'
import AnimeEp from '../../../models/AnimesEp'
import dbConnect from '../../../utils/dbConnect'

const get = async (req, res) => {

    try {
        await dbConnect()

        let pagina = req.query.pagina
        let opt1 = await seExiste(AnimeEp, pagina)

        if (opt1 == true) {//Anime já cadastrado

            let exibir = await AnimeEp.findOne({ 'pagina': pagina })

            res.setHeader('Cache-Control', 's-maxage=300000, stale-while-revalidate')
            res.status(200);
            return res.json(exibir);

        } else {//Não encontrado, então capturar e cadastrar

            const response = await axios.get(`https://www.myanimesonline.biz/animes/episodio/${pagina}/`)
            let $ = cheerio.load(response.data)

            let postTexto = $('div.pagina-conteudo').find("div.post-texto")
            let img = validarImg(postTexto.find("div.post-capa > img").attr("src"))
            let titulo = postTexto.find("div.post-capa > img").attr("alt")
            let ano = ""
            let descricao = postTexto.find("p").eq(0).text()
            let link = $('div.pagina-conteudo').find("video#video > source").attr("src")
            let opcao = ""
            let links = []
            let paginaTemporada = $('div.pagina-conteudo').find("a[title='Lista de Episódios']").attr("href")

            postTexto.find("ul.post-infos > li").each((i, e) => { // loop tipo
                switch ($(e).find("b").text()) {
                    case "Tipo":
                        opcao = $(e).find("span").text()
                        break
                }
            })
            
            links.push(`${opcao}|${link}`)

            const addAnimeEp = new AnimeEp({
                titulo,
                img,
                ano,
                descricao,
                links,
                pagina,
                paginaTemporada
            })

            await addAnimeEp.save()
                .then(() => {
                    console.log('Novo EP de Anime adicionado a DB')
                })
                .catch((err) => {
                    console.log(err.code == 11000 ? 'EP de Anime duplicado' : err)
                })

            let exibir = await AnimeEp.findOne({ 'pagina': pagina })

            res.setHeader('Cache-Control', 's-maxage=300000, stale-while-revalidate')
            res.status(200);
            return res.json(exibir);

        }

    } catch (error) {

        return responseErrorJson(res, 'assistirepanime::get', error)

    }

}

export default get