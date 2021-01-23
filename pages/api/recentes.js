import cheerio from 'cheerio'
import axios from 'axios'
import { responseErrorJson, responseJson, validarImg, exibirTudo, atualizarPorDataSimples } from '../../utils/utils'
import FilmesRecentes from '../../models/FilmesRecentes'
import FilmesDestaque from '../../models/FilmesDestaque'
import SeriesRecentes from '../../models/SeriesRecentes'
import dbConnect from '../../utils/dbConnect'

const get = async (req, res) => {
    try {
        await dbConnect()

        let primeiro = await exibirTudo(FilmesRecentes, 1)

        console.log(await exibirTudo(FilmesRecentes, 1));

        if(atualizarPorDataSimples(primeiro)){
            //console.log('As datas são diferentes, salvar')
            const response = await axios.get('https://www.superflix.net/')
            let $ = cheerio.load(response.data)

            $('div#widget_list_movies_series-3-all.aa-tb.hdd.on').find('ul > li').each(async (i, elem) => {

                let el = $(elem)
                let img = validarImg(el.find('figure > img').attr('src'))
                let titulo = el.find('h2.entry-title').text()
                let nota = el.find('span.vote').text()
                let link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/','assistir/')
                let qualidade = el.find('.Qlty').text()
                let ano = el.find('.year').text()

                const addFilme = new FilmesRecentes({
                    img,
                    titulo,  
                    nota, 
                    link,
                    qualidade,
                    ano
                })

                await addFilme.save().catch((err) => {
                    console.log(err.code == 11000 ? 'Filme duplicado' : err)
                }) 

            })

            $('div#torofilm_wdgt_popular-3-all').find('ul > li').each(async (i, elem) => {

                let el = $(elem)
                let img = validarImg(el.find('figure > img').attr('src'))
                let titulo = el.find('h2.entry-title').text() 
                let nota = el.find('span.vote').text()
                let link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/','assistir/')
                let duracao = el.find('span.time').text()
                let ano = el.find('span.year').text()

                const addFilme = new FilmesDestaque({
                    titulo,
                    img,  
                    nota, 
                    link,
                    duracao,
                    ano
                })

                await addFilme.save().catch((err) => {
                    console.log(err.code == 11000 ? 'Destaque duplicado' : err)
                }) 
            })

            $('div#widget_list_movies_series-4-aa-movies').find('ul > li').each(async (i, elem) => {

                let el = $(elem)
                
                if(el.find('a.lnk-blk').attr('href') == undefined){
                    console.log(el.text());
                }

                let img = validarImg(el.find('figure > img').attr('src'))
                let titulo = el.find('h2.entry-title').text()
                let nota = el.find('span.vote').text()
                let link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/','assistir/')
                let qualidade = el.find('.Qlty').text()
                let ano = el.find('.year').text()

                const addSerie = new SeriesRecentes({
                    titulo,
                    img,  
                    nota, 
                    link,
                    qualidade,
                    ano
                })

                await addSerie.save().catch((err) => {
                    console.log(err.code == 11000 ? 'Serie duplicada' : err)
                }) 

            })

            let filmes_recentes = await exibirTudo(FilmesRecentes)
            let filmes_destaques = await exibirTudo(FilmesDestaque)
            let series_recentes = await exibirTudo(SeriesRecentes)

            let resultado = {filmes_recentes, filmes_destaques, series_recentes}
    
            return responseJson(res, resultado)

        }else{
           // console.log('As datas são iguais, não salvar');
            let filmes_recentes = await exibirTudo(FilmesRecentes)
            let filmes_destaques = await exibirTudo(FilmesDestaque)
            let series_recentes = await exibirTudo(SeriesRecentes)
            
            let resultado = {filmes_recentes, filmes_destaques, series_recentes}
    
            return responseJson(res, resultado)
        }
        
    } catch (error) {
        return responseErrorJson(res, 'recentes::get', error);
    }
}

export default get