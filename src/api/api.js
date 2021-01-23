import axios from 'axios'

const api = async url => {
  const { data } = await axios.get('/api' + url)

  return data
}

export default api
