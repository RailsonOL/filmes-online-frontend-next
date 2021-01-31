import GridItems from '../../../src/grid/GridItems'
import Spotlight from '../../../src/grid/Spotlight'
import Paginator from '../../../src/grid/Paginator'
import SeachBar from '../../../src/searchbar/SeachBar'
import ErrorElem from '../../../src/ErrorElem'
import { useMemo } from 'react'
import useFetch from '../../../src/api/useFetch'
import loading from '../../../src/api/loading'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { server } from '../../../config';

export default function SeeMore ({ data, type, page }){

  const gridMemo = useMemo(() => {
    return (
      <GridItems
        itemsForGrid={data.resultado}
        nameForGrid={`Ver mais ${type}`}
      />
    )
  }, [data])

  const spotMemo = useMemo(() => {
    return <Spotlight />
  }, [])

  //if (error) <ErrorElem />

  return (
    <div className='see-more-container'>
      <Head>
        <title>Ver mais {type}s - AmazoFlix</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='search-bar-home'>
        <SeachBar />
      </div>
      <div className='homepage-container container-main'>
        <main className='grid-main'>
          {gridMemo}
          <Paginator parent={'SeeMore'} currentPage={page} numberPages={data.total_pag}/>
        </main>
        <aside className='spotlight'>{spotMemo}</aside>
      </div>
    </div>
  )
}

export async function getServerSideProps (ctx) {

  const type = ctx.query.SeeMore
  const page = ctx.query.page
  const response = await fetch(`${server}/api/${type}/${page}`)
  const data = await response.json() 

  const res = await fetch(`${server}/api/recentes`)
  const dataRecentes = await res.json()

  return {
    props: {
      data,
      type,
      page,
      dataRecentes
    },
  }
}