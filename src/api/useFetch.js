import axios from 'axios'

const useFetch = async route => {
  const baseUrl = '/api'

  let url = baseUrl + route

  const { data } = await axios.get(url)

  return data
}

export default useFetch
