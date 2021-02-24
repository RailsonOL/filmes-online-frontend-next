import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, validarImg, exibirTudo, atualizarPorDataSimples } from '../../utils/utils'
import AnimesEpRecentes from '../../models/AnimesEpRecentes'
import AnimesRecentes from '../../models/AnimesRecentes'

import dbConnect from '../../utils/dbConnect'

const get = async (req, res) => {
    try {
        await dbConnect()

        let primeiro = await exibirTudo(AnimesEpRecentes, 1)

        if (atualizarPorDataSimples(primeiro)) { //As datas são diferentes, salvar
            const { data } = await axios.get('https://www.myanimesonline.biz/')
            let $ = cheerio.load(data)

            $('div.videos-row').find('ul.videos > li').each(async (i, e) => { // loop episodios recentes

                let pagina = $(e).find('a').attr('href').replace('https://www.myanimesonline.biz/animes/episodio/', '').replace('/','') + '-watch-now'
                let titulo = $(e).find('a').attr('title')
                let img = validarImg($(e).find('img').attr('src'))
                let qualidade = $(e).find('span.selo-ep').text()

                const addAnimeEpRecente = new AnimesEpRecentes({
                    titulo,
                    img,
                    pagina,
                    qualidade
                })

                await addAnimeEpRecente.save().catch((err) => {
                    console.log(err.code == 11000 ? 'AnimeEP recente duplicado' : err)
                })
            })

            $('ul.widget-recentes').find('li').each(async (i, e) => { // loop animes recem adicionados

                let pagina = $(e).find('a').attr('href').replace('https://www.myanimesonline.biz/animes/', '')
                let titulo = $(e).find('a').attr('title')
                let img = validarImg($(e).find('img').attr('src'))
                let qualidade = 'HD'

                const addAnimeEpRecente = new AnimesRecentes({
                    titulo,
                    img,
                    pagina,
                    qualidade
                })

                await addAnimeEpRecente.save().catch((err) => {
                    console.log(err.code == 11000 ? 'Anime recente duplicado' : err)
                })
            })

            let animeseps = await exibirTudo(AnimesEpRecentes)
            let animes = await exibirTudo(AnimesRecentes)

            let resultado = { animeseps, animes }

            res.setHeader('Cache-Control', 's-maxage=43200000, stale-while-revalidate')
            res.status(200);
            return res.json(resultado)

        } else {
            // console.log('As datas são iguais, não salvar');
            let animeseps = await exibirTudo(AnimesEpRecentes)
            let animes = await exibirTudo(AnimesRecentes)

            let resultado = { animeseps, animes }

            res.setHeader('Cache-Control', 's-maxage=43200000, stale-while-revalidate')
            res.status(200);
            return res.json(resultado)
        }

    } catch (error) {
        return responseErrorJson(res, 'animesrecentes::get', error);
    }
}

export default get