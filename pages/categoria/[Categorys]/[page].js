import GridItems from '../../../src/components/grid/GridItems'
import Spotlight from '../../../src/components/grid/Spotlight'
import Paginator from '../../../src/components/grid/Paginator'
import SeachBar from '../../../src/components/searchbar/SeachBar'
import axios from 'axios'
import { useMemo } from 'react'
import Head from 'next/head'
import { server } from '../../../config'
import { encodeDecode } from '../../../utils'

export default function Categorys ({ data, type, page, dataDestaques }) {
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
  const type = encodeDecode(ctx.query.Categorys, 'encode', 'base64')
  const page = ctx.query.page
  const { data } = await axios.get(`${server}/api/categoria/${encodeURIComponent(type)}/${page}`)
  const dataRecentes = await axios.get(`${server}/api/recentes`)

  return {
    props: {
      data,
      type: ctx.query.Categorys,
      page,
      dataDestaques: dataRecentes.data.filmes_destaques
    }
  }
}
