import GridItems from '../../../src/components/grid/GridItems'
import Spotlight from '../../../src/components/grid/Spotlight'
import Paginator from '../../../src/components/grid/Paginator'
import SeachBar from '../../../src/components/searchbar/SeachBar'
import { useMemo } from 'react'
import Head from 'next/head'
import { server } from '../../../config'

export default function SearchPage ({ data, type, page, dataDestaques }) {
  const gridMemo = useMemo(() => {
    return (
      <GridItems
        itemsForGrid={data.resultado}
        nameForGrid={`Pesquisa por ${type}`}
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
        <title>Pesquisar - {type} - AmazoFlix</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='search-bar-home'>
        <SeachBar />
      </div>
      <div className='homepage-container container-main'>
        <main className='grid-main'>
          {gridMemo}
          <Paginator parent={'SearchPage'} currentPage={page} numberPages={data.total_pag} />
        </main>
        <aside className='spotlight'>{spotMemo}</aside>
      </div>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  const type = ctx.query.SearchPage
  const page = ctx.query.page
  const response = await fetch(`${server}/api/pesquisar/${encodeURIComponent(type)}/${page}`)
  const data = await response.json()

  const res = await fetch(`${server}/api/recentes`)
  const dataRecentes = await res.json()

  return {
    props: {
      data,
      type,
      page,
      dataDestaques: dataRecentes.filmes_destaques
    }
  }
}
