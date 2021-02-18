import cheerio from 'cheerio'
import axios from 'axios'
import getUrl from './getUrl'
import { responseErrorJson, responseJson, encodeDecode } from '../../../utils/utils'

const get = async (req, res) => {
    try {
        let url = 'https://animesup.net/Player/Play/play7.php?q=hd&t=C1VzzwzrhTA3V3M9koSvI6oQFEgnFwNPb2HrsMuj6i1CQULu9ZN5UQHs19umjz+6G7G53mYCEleBxlTHZe4x7iTQb9i9FlZiBJpBUta3s/yJ44sswLPeaMordjyIifFGCKkSQyHKJQf+QcK79+nkfYhQp84giY85eHdRT/Q7wvtYLrvfWxM83EQQVMQeW65zGJMQO7uO0h3/&img=https://image.tmdb.org/t/p/original/fP1j1ut04szf7Tgm4aiBk2nzTom.jpg&id=9846'
        let { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
                'origin': 'https://animesup.net',
                'referer': 'https://animesup.net/episodios/digimon-adventure-2020-episodio-01-online-legendado-hd/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'                
              }
        })

        // var result = data.match(/(?<=file: \"\s*).*?(?=\s*",)/gs);
        const $ = cheerio.load(data)
        let source = $('body').find('script').html()

        source = source.match(/(?<=file: \"\s*).*?(?=\s*",)/gs);
        // console.log(encodeDecode(source, 'decode', 'unicode'));

        return responseJson(res, {'data': decodeURIComponent(JSON.parse('"' + source + '"')).slice(0, -1)})

    } catch (err) {
        console.log(err)
        return responseErrorJson(res, err)
    }
}

export default get