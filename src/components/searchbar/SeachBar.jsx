import { useState } from 'react'
import { useRouter } from 'next/router'

const SeachBar = ({ fromMobile }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const submitSearch = (e) => {
    e.preventDefault()
    router.push(`/pesquisar/${searchTerm}/1`)

    if (fromMobile !== undefined) {
      fromMobile.setOpenedMenu(!fromMobile.openedMenu)
    }
  }

  return (
    <div className="searchbar-container">
      <div className="home-search">
        <div className="logo tac">
          <img
            src={'/images/big-logo.svg'}
            alt=""
          />
        </div>
          <form className="search full" onSubmit={submitSearch}>
            <input
              type="text"
              onChange={e => setSearchTerm(e.target.value)}
              className="searchbar-input"
              placeholder="Pesquisar..."
            />
            <button type="submit" className="btn npd lnk"><i className="material-icons sm" style={{ fontSize: '170%' }}>search</i></button>
          </form>
      </div>
    </div>
  )
}

export default SeachBar
