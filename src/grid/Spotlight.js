import { useRouter } from 'next/router'
import Link from 'next/link'


export default function Spotlight ({ dataDestaques }){
  let router = useRouter()

  const listSpotlight = dataDestaques.map((item, index) => {
    return (
      <li key={item._id}>
        <Link href={'/assistir/' + item.pagina}>
          <a>
            <div className='sl-item'>
              <div className='sl-item-number'>
                <h5>{index + 1}</h5>
              </div>
              <div className='sl-thumb'>
                <figure>
                  <img src={item.img} alt='thumb movie' />
                </figure>
              </div>
              <div className='text-side'>
                <p className='sl-title'>{item.titulo}</p>
                <p className='sl-desc'>
                  <span className='sl-rate-tmdb'>{item.nota}</span>
                  <span className='sl-time'>{item.duracao}</span>
                  <span className='sl-year'>{item.ano}</span>
                </p>
              </div>
            </div>
          </a>
        </Link>
      </li>
    )
  })

  const redirectToGenre = e => {
    router.push(e.target.value)
  }

  return (
    <div className='list-spotlight'>
      <div className='spot-hd select-genre'>
        <h2>Categorias</h2>
        <select className='custom-select' onChange={redirectToGenre}>
          <option value=''>Selecione uma categoria</option>
          <option value='/categoria/Ação/1'>Ação</option>
          <option value='/categoria/Animação/1'>Animação</option>
          <option value='/categoria/Animes/1'>Animes</option>
          <option value='/categoria/Aventura/1'>Aventura</option>
          <option value='/categoria/Comédia/1'>Comédia</option>
          <option value='/categoria/Crime/1'>Crime</option>
          <option value='/categoria/Documentário/1'>Documentário</option>
          <option value='/categoria/Drama/1'>Drama</option>
          <option value='/categoria/Eróticos/1'>Eróticos</option>
          <option value='/categoria/Família/1'>Família</option>
          <option value='/categoria/Fantasia/1'>Fantasia</option>
          <option value='/categoria/Faroeste/1'>Faroeste</option>
          <option value='/categoria/Ficção científica/1'>
            Ficção científica
          </option>
          <option value='/categoria/Filmes em HD/1'>Filmes em HD</option>
          <option value='/categoria/Filmes em FullHD/1'>
            Filmes em FullHD
          </option>
          <option value='/categoria/Filmes Clássicos/1'>
            Filmes Clássicos
          </option>
          <option value='/categoria/Filmes Antigos/1'>Filmes Antigos</option>
          <option value='/categoria/Filmes Cult/1'>Filmes Cult</option>
          <option value='/categoria/Filmes Dublados/1'>Filmes Dublados</option>
          <option value='/categoria/Filmes Legendados/1'>
            Filmes Legendados
          </option>
          <option value='/categoria/Filmes Nacionais/1'>
            Filmes Nacionais
          </option>
          <option value='/categoria/Filmes da Disney/1'>
            Filmes da Disney
          </option>
          <option value='/categoria/Filmes da Marvel/1'>
            Filmes da Marvel
          </option>
          <option value='/categoria/Filmes da PassionFlix/1'>
            Filmes da PassionFlix
          </option>
          <option value='/categoria/Filmes Netflix/1'>Filmes Netflix</option>
          <option value='/categoria/Filmes Religiosos e Evangélicos/1'>
            Filmes Religiosos e Evangélicos
          </option>
          <option value='/categoria/Guerra/1'>Guerra</option>
          <option value='/categoria/LGBT/1'>LGBT</option>
          <option value='/categoria/Kids/1'>Kids</option>
          <option value='/categoria/História/1'>História</option>
          <option value='/categoria/Mistério/1'>Mistério</option>
          <option value='/categoria/Música/1'>Música</option>
          <option value='/categoria/Policial/1'>Policial</option>
          <option value='/categoria/Romance/1'>Romance</option>
          <option value='/categoria/Sci-Fi/1'>Sci-Fi</option>
          <option value='/categoria/Suspense/1'>Suspense</option>
          <option value='/categoria/Terror/1'>Terror</option>
          <option value='/categoria/Thriller/1'>Thriller</option>
          <option value='/categoria/Zumbi/1'>Zumbi</option>

          <option value='/categoria/Séries Baseada em Fatos Reais'>
            Séries Baseada em Fatos Reais
          </option>
          <option value='/categoria/Séries Baseadas em Livros'>
            Séries Baseadas em Livros
          </option>
          <option value='/categoria/Séries Antigas/1'>Séries Antigas</option>
          <option value='/categoria/Séries Coreanas/1'>Séries Coreanas</option>
          <option value='/categoria/Séries da Amazon/1'>Séries da Amazon</option>
          <option value='/categoria/Séries Dubladas/1'>Séries Dubladas</option>
          <option value='/categoria/Séries Legendadas/1'>
            Séries Legendadas
          </option>
          <option value='/categoria/Séries Lançamentos/1'>
            Séries Lançamentos
          </option>
          <option value='/categoria/Séries Netflix/1'>Séries Netflix</option>
          <option value='/categoria/Séries da AMC/1'>Séries da AMC</option>
          <option value='/categoria/Séries da ABC/1'>Séries da ABC</option>
          <option value='/categoria/Séries da Apple TV/1'>
            Séries da Apple TV
          </option>
          <option value='/categoria/Séries da Amazon/1'>Séries da Amazon</option>
          <option value='/categoria/Séries da BBC/1'>Séries da BBC</option>
          <option value='/categoria/Séries da DC/1'>Séries da DC</option>
          <option value='/categoria/Séries da Disney/1'>Séries da Disney</option>
          <option value='/categoria/Séries da FOX/1'>Séries da FOX</option>
          <option value='/categoria/Séries da FX/1'>Séries da FX</option>
          <option value='/categoria/Séries GloboPlay/1'>Séries GloboPlay</option>
          <option value='/categoria/Séries em HD/1'>Séries em HD</option>
          <option value='/categoria/Séries da Hulu/1'>Séries da Hulu</option>
          <option value='/categoria/Séries da HBO/1'>Séries da HBO</option>
          <option value='/categoria/Séries Médicas/1'>Séries Médicas</option>
          <option value='/categoria/Séries Nacionais/1'>Séries Nacionais</option>
          <option value='/categoria/Séries da NBC/1'>Séries da NBC</option>
          <option value='/categoria/Séries da PassionFlix/1'>
            Séries da PassionFlix
          </option>
          <option value='/categoria/Série da ShowTime/1'>
            Série da ShowTime
          </option>
          <option value='/categoria/Séries da Starz/1'>Séries da Starz</option>
          <option value='/categoria/Série da SyFy/1'>Série da SyFy</option>
          <option value='/categoria/Séries da TNT/1'>Séries da TNT</option>
          <option value='/categoria/Séries da The CW/1'>Séries da The CW</option>
        </select>
      </div>
      <div className='div-spotlight'>
        <h2>Destaques</h2>
      </div>
      <ul>{listSpotlight}</ul>
    </div>
  )
}