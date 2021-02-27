import api from '../../src/api/api'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import WatchDesc from '../../src/watch/WatcDesc'
import Player from '../../src/watch/Player'
import { server } from '../../config'

const PostEp = ({ listEps, setEpisode }) => {
  function scrollTop() {
    document.querySelector('.rate-big').scrollIntoView({
      behavior: "smooth"
    })
  }

  const renderEps = listEps.map((item, index) => (
    <a herf='#player-on' onClick={function(){ setEpisode(item); scrollTop()}} key={index.toString()}>
      <li className='list-ep-container'>
        <div className='thumb-ep'>
          <figure>
            <img src={item.img} alt='' />
          </figure>
        </div>
        <div className='entry-ep'>
          <h2 className='ep-num'>{item.num_ep}</h2>
          <h4 className='ep-name'>{item.nome_ep}</h4>
          <span className='ep-data'>{item.data}</span>
        </div>
      </li>
    </a>
  ))

  return renderEps
}

export default function Watch({ data }) {
  const [contentLinks, setContentLinks] = useState()
  const [episode, setEpisode] = useState({})
  useEffect(async () => {
    document.querySelector('div.rate-big').innerHTML += '<span class="carregando"></span>'
    if (episode != {}) {
      let linkActualEp = episode.link ? episode.link.replace('episodio/', 'animeeps/') : episode.link 
      api('/' + linkActualEp)
        .then(response => {
          document.querySelector('div.rate-big > span.carregando').remove()
          setContentLinks(response.links)
        })
        .catch(err => console.error(err))
    }

    return () => {
      seasonData = {}
    }
  }, [episode])

  return (
    <div className='container-watch'>
      <Head>
        <title>{data.titulo} - AmazoFlix</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <WatchDesc watchDescData={data} />

      {contentLinks && (
        <div id='player' name='episodio'>
          <Player playerOption={contentLinks} />
        </div>
      )}

      {data.tipo == "TemporadaAnime" && (
        <div className='grid-eps'>
          <ul>
            <PostEp listEps={data.episodios} setEpisode={setEpisode} />
          </ul>
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  let pagina = ctx.query.itemToWatch

  if (ctx.query.itemToWatch.includes('-watch-now')) {
    pagina = ctx.query.itemToWatch.replace('-watch-now', '')
    let AnimeEp = await fetch(`${server}/api/animeeps/${pagina}`)
    AnimeEp = await AnimeEp.json()

    pagina = AnimeEp.paginaTemporada
  }

  const response = await fetch(`${server}/api/anime/${pagina}`)
  const data = await response.json()

  return {
    props: { data }
  }
}