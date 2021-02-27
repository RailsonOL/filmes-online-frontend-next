import api from '../../src/api/api'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import WatchDesc from '../../src/watch/WatcDesc'
import Player from '../../src/watch/Player'
import GridEpisodes from '../../src/watch/GridEpisodes'
import { server } from '../../config'

export default function Watch({ data }) {
  const [contentLinks, setContentLinks] = useState()
  const [episode, setEpisode] = useState({})
  let seasonData = data.temporadas

  useEffect(() => {
    if (data.links) {
      setContentLinks(data.links)
    }

  }, [contentLinks])

  useEffect(async () => {
    document.querySelector('div.rate-big').innerHTML += '<span class="carregando"></span>'
    if (episode != {}) {
      api('/' + episode.link)
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

      {data.temporadas && (
        <div id='content-serie'>
          <GridEpisodes setEpisode={setEpisode} seasonData={seasonData} />
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const response = await fetch(`${server}/api/assistir/${ctx.query.itemToWatch}`)
  const data = await response.json()

  return {
    props: { data }
  }
}