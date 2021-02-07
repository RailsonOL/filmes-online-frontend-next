import GridItems from '../../../src/grid/GridItems'
import Spotlight from '../../../src/grid/Spotlight'
import Paginator from '../../../src/grid/Paginator'
import SeachBar from '../../../src/searchbar/SeachBar'
import { useMemo } from 'react'
import Head from 'next/head'
import { server } from '../../../config';

export default function Categorys ({ data, type, page, dataDestaques }){
  const gridMemo = useMemo(() => {
    return (
      <GridItems
        itemsForGrid={data.resultado}
        nameForGrid={`Categoria ${type}`}
      />
    )
  }, [data])

  const spotMemo = useMemo(() => {
    return <Spotlight dataDestaques={dataDestaques}/>
  }, [])

 // if (error) <ErrorElem />

  return (
    <div className='see-more-container'>
      <Head>
        <title>Categorias - {type} - AmazoFlix</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='search-bar-home'>
        <SeachBar />
      </div>
      <div className='homepage-container container-main'>
        <main className='grid-main'>
          {gridMemo}
          <Paginator parent={'Category'} currentPage={page} numberPages={data.total_pag} />
        </main>
        <aside className='spotlight'>{spotMemo}</aside>
      </div>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  const type = ctx.query.Categorys
  const page = ctx.query.page
  const response = await fetch(`${server}/api/categoria/${type}/${page}`)
  const data = await response.json()

  const res = await fetch(`${server}/api/recentes`)
  const dataRecentes = await res.json()

  return {
    props: {
      data,
      type,
      page,
      dataDestaques: dataRecentes.filmes_destaques 
    },
  }
}
