const httpStatus = require('http-status-codes')

const encodeDecode = (string, type = 'encode', encodeType = 'base64') => {
    if (type == 'encode') {
        const result = new Buffer.from(string).toString(encodeType)
        return result
    } else if(type == 'decode') {
        const result = new Buffer.from(string, encodeType).toString('utf8')
        return result
    }
}

const hex2a = (hex) => {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16)
        if (v) str += String.fromCharCode(v)
    }
    return str
}

const validarImg = (img = '') => {
    if(img.includes('https:') || img.includes('http:')){
        return img
    }else{
        img = `https:${img}`
        return img
    }
}

const exibirEps = (temp) => {
    let episodios = JSON.stringify(temp.episodios).replace('["{', '[{').replace('}"]', '}]').replace(/\\/g, '').replace(/","/g, ',')
    episodios = JSON.parse(episodios)

    let exibir = {episodios, "pagina": temp.pagina}

    return exibir
}

const exibirTudo = async (collec, limite = 12) => {
    let resultado

    await collec.find().sort({'updatedAt': -1}).limit(limite)
    .then((result) => {
        resultado = result
    })
    .catch((err) => {
        console.log(`Erro na função "exibirTudo": ${err}`);
    })

    return resultado
}

const seExiste = async (collec, pagina) => {
    let resultado

    await collec.findOne({ 'pagina': pagina })
    .then((result) => {
        if(result == null){
            resultado = false
        }else{
            resultado = true
        }
    })
    .catch((err) => {
        console.log(`Erro na função "seExiste": ${err}`)
    })

    return resultado
}

const responseJson = (res, data, statusCode = httpStatus.OK) => {
    res.setHeader('Cache-Control', 's-maxage=80000, stale-while-revalidate')
    res.status(200);
    return res.json(data);
}

const responseErrorJson = (res, methodName, error, statusCode = httpStatus.INTERNAL_SERVER_ERROR) => {
    res.status(error.httpCode || statusCode)
    console.error(methodName, error.message)
    return res.json({
        error: error.message || error.toString()
    })
}

const atualizarPorData = (comparador, intervalo = 1, mesesAdicionado = 3) => {
    let dataDB

    let dataDeCriacao = new Date(comparador.createdAt)
    let anoDeLancamento = comparador.ano == undefined ? dataDeCriacao.getFullYear() : comparador.ano 

    let dataAtual = new Date()
    let anoAtual = dataAtual.getFullYear()

    if (comparador.toString() == '') {
        dataDB = dataAtual.getMonth()-intervalo
    }else{
        dataDB = new Date(comparador.updatedAt)
        dataDB = dataDB.getDate()
    }
    // console.log(`${dataDB+intervalo} <= ${dataAtual.getDate()} && ${anoDeLancamento} >= ${anoAtual-1}`)

    return dataDB+intervalo <= dataAtual.getDate() && anoDeLancamento >= anoAtual-1
}

const atualizarPorDataSimples = (comparador, intervalo = 1) => {
    let dataDB

    let dataAtual = new Date()

    if (comparador.toString() == '') {
        dataDB = dataAtual.getDate()-intervalo
    }else{
        dataDB = new Date(comparador[0].updatedAt)
        dataDB = dataDB.getDate()
    }

    return dataDB != dataAtual.getDate()
}

module.exports = {
    hex2a,
    exibirTudo,
    responseErrorJson,
    responseJson,
    seExiste,
    validarImg,
    exibirEps,
    atualizarPorData,
    atualizarPorDataSimples,
    encodeDecode
}