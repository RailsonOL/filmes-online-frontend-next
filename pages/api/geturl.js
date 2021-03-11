import axios from 'axios'
import { responseJson } from '../../utils'

const get = async (req, res) => {
  const { data } = await axios.get('https://api.animesgratisbr.com/video/16788')

  return responseJson(res, { data })
}

export default get

// https://cors-anywhere.herokuapp.com/https://api.animesgratisbr.com/video/16788
//   const { data } = await axios.get('https://cors-anywhere.herokuapp.com/https://api.animesgratisbr.com/video/16788', {
//     headers: {
//       origin: 'https://api.animesgratisbr.com/video/16788'
//     }
//   })
