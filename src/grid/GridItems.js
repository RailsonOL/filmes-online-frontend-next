export default function GridItems(props) {
  let { itemsForGrid, nameForGrid, seeMore, toPage } = props
  return (
    <div className='widget_list_movies'>
      <header className="section-header">
        <div className="rw alg-cr jst-sb">
          <h3 className="section-title">{nameForGrid}</h3>
          <ul className="rw">
          {
            seeMore != undefined
            ? 
            <li><a href={seeMore}><i className="material-icons" style={{ fontSize: 15 }}>add</i> Ver mais</a></li>
            :
            ''
          }
          </ul>
        </div>
        <ul className="aa-tbs ax-tbs" ></ul>
      </header>
      <ul className='post-lst rw sm rcl2 rcl3a rcl4b rcl3c rcl4d rcl6e'>
        <PostItem itemsForGrid={itemsForGrid} toPage={toPage} />
      </ul>
    </div>
  )
}

const PostItem = props => {
  const { itemsForGrid, toPage } = props
  const rateTmdb = (nota)=> {
    return nota ? nota.replace('TMDB', '') : '--'
  }

  return itemsForGrid.map((item, index) => (
    <li className="movies" key={item._id}>
      <article className="post dfx fcl movies">
        <header className="entry-header">
          <h2 className="entry-title">{item.titulo}</h2>
          <div className="entry-meta"> <span className="vote"><span>TMDB</span> {rateTmdb(item.nota)}</span></div>
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
          <span className="play material-icons" style={{ fontSize: 40 }}>play_arrow</span>
        </div> <a href={`/${toPage}/${item.pagina}`}
          className="lnk-blk"></a>
      </article>
    </li>
  ))
}