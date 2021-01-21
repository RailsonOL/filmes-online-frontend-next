const { responseErrorJson, responseJson, exibirTudo, validarImg, atualizarPorDataSimples } = require('../utils');
const collection = require('../models/dados')
const cheerio =  require('cheerio')
const axios = require('axios')

const get = async (req, res) => {
    try {
        let primeiro = await exibirTudo(collection.FilmesRecentes, 1)

        if(atualizarPorDataSimples(primeiro)){
            //console.log('As datas são diferentes, salvar')
            const response = await axios.get('https://www.superflix.net/')
            let $ = cheerio.load(response.data)

            $('section#widget_list_movies_series-3').find('li').each(async (i, elem) => {

                let el = $(elem)
                let img = validarImg(el.find('figure > img').attr('src'))
                let titulo = el.find('h2.entry-title').text()
                let nota = el.find('span.vote').text()
                let link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/','assistir/')
                let qualidade = el.find('.Qlty').text()
                let ano = el.find('.year').text()

                const addFilme = new collection.FilmesRecentes({
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

                const addFilme = new collection.FilmesDestaque({
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

            $('section#widget_list_movies_series-4').find('li').each(async (i, elem) => {

                let el = $(elem)
                let img = validarImg(el.find('figure > img').attr('src'))
                let titulo = el.find('h2.entry-title').text()
                let nota = el.find('span.vote').text()
                let link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/','assistir/')
                let qualidade = el.find('.Qlty').text()
                let ano = el.find('.year').text()

                const addSerie = new collection.SeriesRecentes({
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

            let filmes_recentes = await exibirTudo(collection.FilmesRecentes)
            let filmes_destaques = await exibirTudo(collection.FilmesDestaque)
            let series_recentes = await exibirTudo(collection.SeriesRecentes)

            let resultado = {filmes_recentes, filmes_destaques, series_recentes}
    
            return responseJson(res, resultado)

        }else{
           // console.log('As datas são iguais, não salvar');
            let filmes_recentes = await exibirTudo(collection.FilmesRecentes)
            let filmes_destaques = await exibirTudo(collection.FilmesDestaque)
            let series_recentes = await exibirTudo(collection.SeriesRecentes)
            
            let resultado = {filmes_recentes, filmes_destaques, series_recentes}
    
            return responseJson(res, resultado)
        }
        
    } catch (error) {
        return responseErrorJson(res, 'recentes::get', error);
    }
}

module.exports = {
    get
}