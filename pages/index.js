/* lib */
import Head from 'next/head'
/* compoents */
import SeachBar from '../src/components/searchbar/SeachBar'
import Spotlight from '../src/components/grid/Spotlight'
import GridItemsCarousel from '../src/components/grid/GridItemsCarousel'
import { server } from '../config'

const Home = ({ data, dataAnimes }) => {
  return (
    <div className='home-page'>
      <Head>
        <title>AmazoFlix - Filmes e Series de Graça</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta charset="UTF-8" />
        <meta name="title" content="AmazoFlix - Filmes e Series de Graça" />
        <meta name="description" content="AmazoFlix - Filmes e Series de Graça" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amazoflix.vercel.app/" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="Filmes e Series de Graça" />
        <meta property="og:image" content="" />
      </Head>
      <div className='search-bar-home'>
        <SeachBar />
      </div>
      <div className='container-main homepage-container'>
        <main className='grid-main'>
          <div className='container-grid'>
            <GridItemsCarousel
              itemsForGrid={data.filmes_recentes}
              nameForGrid={'Filmes Recentes'}
              seeMore={'/vermais/filme/1'}
              toPage={''}
              idForCarousel={'filmes_recentes'}
            />
          </div>
          <div className='container-grid'>
            <GridItemsCarousel
              itemsForGrid={data.series_recentes}
              nameForGrid={'Series Recentes'}
              seeMore={'/vermais/serie/1'}
              toPage={''}
              idForCarousel={'series_recentes'}
            />
          </div>
          <div className='container-grid'>
            <GridItemsCarousel
              itemsForGrid={dataAnimes.animeseps}
              nameForGrid={'Episódios de Animes'}
              toPage={'anime'}
              idForCarousel={'animeseps'}
            />
          </div>
          <div className='container-grid'>
            <GridItemsCarousel
              itemsForGrid={dataAnimes.animes}
              nameForGrid={'Animes Recentes'}
              seeMore={'/vermais/allanimes/1'}
              toPage={'anime'}
              idForCarousel={'animes'}
            />
          </div>

        </main>
        <aside className='spotlight'>
          <Spotlight dataDestaques={data.filmes_destaques} />
        </aside>
      </div>
    </div>
  )
}

export default Home

export async function getServerSideProps (context) {
  const response = await fetch(server + '/api/recentes')
  const data = await response.json()

  let dataAnimes = await fetch(server + '/api/animesrecentes')
  dataAnimes = await dataAnimes.json()

  return {
    props: { data, dataAnimes }
  }
}
