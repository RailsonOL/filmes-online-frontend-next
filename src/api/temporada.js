const cheerio =  require('cheerio')
const axios = require('axios')
const { responseErrorJson, responseJson, seExiste, validarImg, exibirEps, atualizarPorData} = require('../utils')
const { Temporada } = require('../models/dados')

const get = async (req, res) => {
    try {
        
        let pagina = req.params.pagina
        let opt1 = await seExiste(Temporada, pagina)

        if (opt1 == true) { //Serie ou filme já cadastrado
            
            let primeiroDaLista =  await Temporada.findOne({ 'pagina': pagina })
            
            if(atualizarPorData(primeiroDaLista, 5)){ // Atualizar links e descrção a cada 5 dias se foi criado a menos de 3 meses e se for desse ano

                const response = await axios.get(`https://www.superflix.net/temporada/${pagina}`)
                const $ = cheerio.load(response.data)

                let episodios = []

                $('ul#episode_by_temp').find('li').each(function (index, elem) {
                    let el = $(elem)
                    let img = validarImg(el.find('figure > img').attr('src'))
                    let num_ep = el.find('span.num-epi').text()
                    let nome_ep = el.find('h2.entry-title').text()
                    let link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/','')
                    let data = el.find('span.time').text()
            
                    episodios.push(`{"img": "${img}", "num_ep": "${num_ep}", "nome_ep": "${nome_ep}", "link": "${link}", "data": "${data}"}`)
                })

                await Temporada.findOneAndUpdate({ 'pagina': pagina }, { episodios }, {upsert: true}, function(err, doc) {
                    if (err) return res.send(500, {error: err})
                    return console.log(`Episodios de ${pagina} atualizado`)
                })

                let exibir = await Temporada.findOne({ 'pagina': pagina })

                return responseJson(res, exibir)
            }

            let exibir = await Temporada.findOne({ 'pagina': pagina })
            
            return responseJson(res, exibirEps(exibir))

        } else { //Não encontrado, então capturar e cadastrar
            
            const response = await axios.get(`https://www.superflix.net/temporada/${pagina}`)
            let $ = cheerio.load(response.data)
            
            let episodios = []
            let temporada = $('button.btn.lnk.npd.aa-arrow-right').text()
            
            $('ul#episode_by_temp').find('li').each(function (index, elem) {
                let el = $(elem)
                let img = validarImg(el.find('figure > img').attr('src'))
                let num_ep = el.find('span.num-epi').text()
                let nome_ep = el.find('h2.entry-title').text()
                let link = el.find('a.lnk-blk').attr('href').replace('https://www.superflix.net/','')
                let data = el.find('span.time').text()
        
                episodios.push(`{"img": "${img}", "num_ep": "${num_ep}", "nome_ep": "${nome_ep}", "link": "${link}", "data": "${data}"}`)
    
            })
            
            const addTemporada = new Temporada({
                temporada,
                episodios,
                pagina
            })
    
            await addTemporada.save() 
            .then(() => { 
                console.log('Nova temporada adicionado a DB')
            })
            .catch((err) => {
                console.log(err.code == 11000 ? 'Temporada duplicado' : err)
            })
    
            let exibir = await Temporada.findOne({ 'pagina': pagina })
            
            return responseJson(res, exibirEps(exibir))
            
        }

    } catch (error) {
        //console.log(error)
        return responseErrorJson(res, 'listepstemporada::get', error)
    }
}

module.exports = {
    get
}