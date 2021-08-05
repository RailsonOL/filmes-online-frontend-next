import api from '../../src/api/api'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import WatchDesc from '../../src/components/watch/WatcDesc'
import Player from '../../src/components/watch/Player'
import GridEpisodes from '../../src/components/watch/GridEpisodes'
import { server } from '../../config'
import { encodeDecode } from '../../utils'

export default function Watch ({ data }) {
  const [contentLinks, setContentLinks] = useState()
  const [episode, setEpisode] = useState({})
  let seasonData = data.temporadas

  useEffect(() => {
    if (data.links) {
      setContentLinks(data.links)
    }
  }, [contentLinks])

  useEffect(async () => {
    if (episode.data) {
      document.querySelector('div.rate-big').innerHTML += '<span class="carregando"></span>'
      api('/' + episode.link)
        .then(response => {
          document.querySelector('div.rate-big > span.carregando').remove()
          setContentLinks(response.links)
          document.querySelector('aside.video-options > h4').innerHTML = response.titulo
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

      {data.temporadas && (
        <div id='content-serie'>
          <GridEpisodes setEpisode={setEpisode} seasonData={seasonData} />
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps (ctx) {
  const itemToWatch = encodeDecode(ctx.query.itemToWatch, 'encode', 'base64')
  const response = await fetch(`${server}/api/assistir-serie/${encodeURIComponent(itemToWatch)}`)
  const data = await response.json()

  return {
    props: { data }
  }
}
