import Link from 'next/link'

export default function GridItems(props) {
  let { itemsForGrid, nameForGrid } = props

  return (
    <div className='widget_list_movies'>
      <div className='rw alg-cr jst-sb'>
        <h2>{nameForGrid}</h2>
      </div>
      <hr className='hr-bottom-head-grid' />
      <ul className='post-lst rw sm rcl2 rcl3a rcl4b rcl3c rcl4d rcl6e'>
        <PostItem itemsForGrid={itemsForGrid} />
      </ul>
    </div> 
  )
}

const PostItem = props => {
  const { itemsForGrid } = props
  return itemsForGrid.map((item, index) => (
    <li className="movies" key={item._id}>
      <article className="post dfx fcl movies">
        <header className="entry-header">
          <h2 className="entry-title">{item.titulo}</h2>
          <div className="entry-meta"> <span className="vote"><span>TMDB</span> {item.nota.replace('TMDB', '') || '10.0'}</span></div>
        </header>
        <div className="post-thumbnail or-1">
          <figure>
            <img loading="lazy"
              src={item.img}
              alt={item.titulo} />
          </figure>
          <span className="post-ql">
            <span className="Qlty">{item.qualidade || 'HD'}</span>
          </span>
          <span className="year">{item.ano}</span>
          <span className="play material-icons">play_arrow</span>
        </div> <a href={'/assistir/' + item.pagina }
          className="lnk-blk"></a>
      </article>
    </li>
  ))
}