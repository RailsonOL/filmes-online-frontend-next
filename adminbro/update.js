const cheerio =  require('cheerio')
const axios = require('axios')
const { Filme, Serie, Epsodios } = require('../models/dados')
const { hex2a } = require('../utils')

const updateSerie = async (pagina) => {
    const response = await axios.get(`https://www.superflix.net/${pagina}`)
    let $ = cheerio.load(response.data)

    let descricao = $('div.dfxb.alg-cr').find('div.description').text()
    
    let temporadas = []
    $('div.aa-drp.choose-season').each((i, e) => {
        let el = $(e)
        let temp = el.text()
        let link = el.find('a').attr('href').replace('https://www.superflix.net/','')
        temporadas.push(`${temp}|${link}`)
    })

    await Serie.findOneAndUpdate({ 'pagina': pagina }, { 'descricao': descricao, 'temporadas': temporadas }, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err})
        return console.log('Serie Atualizada.')
    })

}

const updateFilme = async (pagina) => {
    
    const response = await axios.get(`https://www.superflix.net/${pagina}`)
    let $ = cheerio.load(response.data)

    let descricao = $('div.dfxb.alg-cr').find('div.description').text()
    let links = []

    $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each( (i, e) => {
        let el = $(e)
        let opcao = el.attr('id')
        let link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

        opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

        links.push(`${opcao}|${link}`)
    })

    await Filme.findOneAndUpdate({ 'pagina': pagina }, { 'descricao': descricao, 'links': links }, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err})
        return console.log('Filme Atualizado.')
    })

}

const updateEpisodio = async (pagina) => {
    
    const response = await axios.get(`https://www.superflix.net/episodio/${pagina}`)
    let $ = cheerio.load(response.data)

    let descricao = $('div.dfxb.alg-cr').find('div.description').text()
    let links = []

    $('aside#aa-options.video-player.aa-cn').find('div.video.aa-tb').each( (i, e) => {
        let el = $(e)
        let opcao = el.attr('id')
        let link = hex2a(el.find('a').attr('href').split('auth=')[1]).replace(/&#038;/g, '&')

        opcao = $(`a[href="#${opcao}"]`).find('span.server').text().split('-')[1]

        links.push(`${opcao}|${link}`)
    })

    await Epsodios.findOneAndUpdate({ 'pagina': pagina }, { 'descricao': descricao, 'links': links }, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err})
        return console.log('Episodio Atualizado.')
    })
}

module.exports = {
    updateFilme,
    updateSerie,
    updateEpisodio
}

