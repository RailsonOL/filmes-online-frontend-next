const cheerio =  require('cheerio')
const axios = require('axios')
const { responseErrorJson, responseJson, hex2a, seExiste, validarImg, atualizarPorData} = require('../utils');
const collection = require('../models/dados')


const get = async (req, res) => {
    
    try {
        let pagina = req.params.pagina
        let episodio = await collection.Epsodios.findOne({ 'pagina': pagina })

        let opt1 = await seExiste(collection.Epsodios, pagina)

        if(opt1 == true){//Serie ou filme já cadastrado
            
            if(atualizarPorData(episodio, 5)){ // Atualizar links e descrção a cada 5 dias se foi criado a menos de 3 meses e se for desse ano

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

                collection.Epsodios.findOneAndUpdate({ 'pagina': pagina }, { 'descricao': descricao, 'links': links }, {upsert: true}, function(err, doc) {
                    if (err) return res.send(500, {error: err})
                    return console.log('Episodio atualizado.')
                })

                let exibir = await collection.Epsodios.findOne({ 'pagina': pagina })

                return responseJson(res, exibir)
            }

            let exibir = await collection.Epsodios.findOne({ 'pagina': pagina })

            return responseJson(res, exibir)

        }else{//Não encontrado, então capturar e cadastrar

            let pagina = req.params.pagina
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
    
            const addEpsodio = new collection.Epsodios({
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
    
            let exibir = await collection.Epsodios.findOne({ 'pagina': pagina })
    
            return responseJson(res, exibir)    

        }

    } catch (error) {

        return responseErrorJson(res, 'assistirep::get', error)

    }

}

module.exports = {
    get
}