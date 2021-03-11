import axios from 'axios'
import { responseJson } from '../../utils'

const get = async (res, req) => {
  // https://cors-anywhere.herokuapp.com/https://api.animesgratisbr.com/video/16788
  const { data } = await axios.get('https://api.animesgratisbr.com/video/16788')
  return responseJson(res, data)
}

export default get
