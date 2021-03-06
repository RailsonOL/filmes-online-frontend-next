/* eslint-disable new-cap */

const deleteAllAfter = async (collec, skip = 12) => {
  const newArr = []
  await collec.find().sort({ updatedAt: -1 }).skip(skip)
    .then((result) => {
      result.map(a => newArr.push(a._id))
    })
    .catch((err) => {
      throw err
    })

  await collec.deleteMany({ _id: { $in: newArr } })
}

const encodeDecode = (string, type = 'encode', encodeType = 'base64') => {
  if (type === 'encode') {
    const result = new Buffer.from(string).toString(encodeType)
    return result
  } else if (type === 'decode') {
    const result = new Buffer.from(string, encodeType).toString('utf8')
    return result
  }
}

const hex2a = (hex) => {
  let str = ''
  for (let i = 0; i < hex.length; i += 2) {
    const v = parseInt(hex.substr(i, 2), 16)
    if (v) str += String.fromCharCode(v)
  }
  return str
}

const validarImg = (img = '') => {
  if (img.includes('https:') || img.includes('http:')) {
    return img
  } else {
    img = `https:${img}`
    return img
  }
}

const exibirEps = (temp) => {
  let episodios = JSON.stringify(temp.episodios).replace('["{', '[{').replace('}"]', '}]').replace(/\\/g, '').replace(/","/g, ',')
  episodios = JSON.parse(episodios)

  const exibir = {
    episodios,
    titulo: temp.titulo,
    img: temp.img,
    ano: temp.ano,
    descricao: temp.descricao,
    categorias: temp.categorias,
    tipo: temp.tipo,
    pagina: temp.pagina
  }

  return exibir
}

const exibirTudo = async (collec, limite = 12) => {
  let resultado

  await collec.find().sort({ updatedAt: -1 }).limit(limite)
    .then((result) => {
      resultado = result
    })
    .catch((err) => {
      console.log(`Erro na função "exibirTudo": ${err}`)
    })

  return resultado
}

const seExiste = async (collec, pagina) => {
  let resultado

  await collec.findOne({ pagina: pagina })
    .then((result) => {
      if (result == null) {
        resultado = false
      } else {
        resultado = true
      }
    })
    .catch((err) => {
      console.log(`Erro na função "seExiste": ${err}`)
    })

  return resultado
}

const responseJson = (res, data, statusCode = 200) => {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.status(200)
  return res.json(data)
}

const responseErrorJson = (res, methodName, error, statusCode = 500) => {
  res.status(error.httpCode || statusCode)
  console.error(methodName, error.message)
  return res.json({
    error: error.message || error.toString()
  })
}

const atualizarPorData = (comparador, intervalo = 1, mesesAdicionado = 3) => {
  let dataDB

  const dataDeCriacao = new Date(comparador.createdAt)
  const anoDeLancamento = comparador.ano === undefined ? dataDeCriacao.getFullYear() : comparador.ano

  const dataAtual = new Date()
  const anoAtual = dataAtual.getFullYear()

  if (comparador.toString() === '') {
    dataDB = dataAtual.getMonth() - intervalo
  } else {
    dataDB = new Date(comparador.updatedAt)
    dataDB = dataDB.getDate()
  }

  return dataDB + intervalo <= dataAtual.getDate() && anoDeLancamento >= anoAtual - 1
}

const atualizarPorDataSimples = (comparador, intervalo = 1) => {
  let dataDB

  const dataAtual = new Date()

  if (comparador.toString() === '') {
    dataDB = dataAtual.getDate() - intervalo
  } else {
    dataDB = new Date(comparador[0].updatedAt)
    dataDB = dataDB.getDate()
  }

  return dataDB !== dataAtual.getDate()
}

export {
  hex2a,
  exibirTudo,
  responseErrorJson,
  responseJson,
  seExiste,
  validarImg,
  exibirEps,
  atualizarPorData,
  atualizarPorDataSimples,
  encodeDecode,
  deleteAllAfter
}
