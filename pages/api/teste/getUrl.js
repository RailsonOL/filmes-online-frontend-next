import axios from 'axios'

export default async function getUrl(url){

    try {
        const params = new URLSearchParams()
        params.append('action', 'doo_player_ajax')
        params.append('post', '9846')
        params.append('nume', '1')
        params.append('type', 'tv')

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'origin': 'https://animesup.net',
                'referer': 'https://animesup.net/episodios/digimon-adventure-2020-episodio-01-online-legendado-hd/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        }

        let { data } = await axios.post(url, params, config)
        return data.embed_url

    } catch (err) {
        return console.log(err)
    }
}