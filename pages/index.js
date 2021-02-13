/* lib */
import Link from 'next/link'
import Head from 'next/head'
/* compoents*/
import SeachBar from '../src/searchbar/SeachBar'
import Spotlight from '../src/grid/Spotlight'
import GridItems from '../src/grid/GridItems'
import { server } from '../config';

const Home = ({ data }) => {

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
            <GridItems
              itemsForGrid={data.filmes_recentes}
              nameForGrid={'Filmes Recentes'}
              seeMore={'/vermais/filme/1'}
            />
          </div>
          <div className='container-grid'>
            <GridItems
              itemsForGrid={data.series_recentes}
              nameForGrid={'Series Recentes'}
              seeMore={'/vermais/serie/1'}
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

  return {
    props: { data }
  }
}
