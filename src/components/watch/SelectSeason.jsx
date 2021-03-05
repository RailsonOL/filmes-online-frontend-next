const SelectSeason = (props) => {
  const { seasonCurrent, seasonsHandled, setSeasonCurrent } = props

  const handleChangeSeason = event => {
    const seasonSelected = seasonsHandled.find(obj => {
      return obj.season === event.target.value
    })
    setSeasonCurrent(seasonSelected)
  }

  const selectElement = seasonsHandled.map((item, index) => (
    <option value={item.season} key={index.toString()}>
      {item.season}
    </option>
  ))

  return (
    <select
      onChange={handleChangeSeason}
      value={seasonCurrent.season}
      className='custom-select'
    >
      {selectElement}
    </select>
  )
}

export default SelectSeason
