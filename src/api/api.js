const apiBase = process.env.API_URL

const api = async url => {
  let data = await fetch(apiBase + url)
    .then(res => res.json())
    .catch(err => err)

  return data
}

export default api
