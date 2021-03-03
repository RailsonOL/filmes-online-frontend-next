/* lib */
import Head from 'next/head'
/* compoents*/
import SeachBar from '../src/searchbar/SeachBar'
import Spotlight from '../src/grid/Spotlight'
import GridItemsCarousel from '../src/grid/GridItemsCarousel'
import { server } from '../config';

const Home = ({ data, dataAnimes }) => {

  return (
    <div className='home-page'>
      <Head>
        <title>AmazoFlix - Filmes e Series de Graça</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
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
              toPage={'assistir'}
              idForCarousel={'filmes_recentes'}
            />
          </div>
          <div className='container-grid'>
            <GridItemsCarousel
              itemsForGrid={data.series_recentes}
              nameForGrid={'Series Recentes'}
              seeMore={'/vermais/serie/1'}
              toPage={'assistir'}
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
          <Spotlight dataDestaques={data.filmes_destaques}  />
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
