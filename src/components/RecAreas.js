import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { RatingIcons } from './RatingIcons'
import { RecAreaMap } from './RecAreaMap'
import loadingGif from '../assets/loading.gif'
import { states } from './helpers'
import Select from 'react-select'
import { UserContext, ThemeContext } from './Context'

export const RecAreas = () => {

  const { currentUser } = useContext(UserContext)
  const { darkMode } = useContext(ThemeContext)
  const [recAreasData, updateRecAreasData] = useState([])
  const [query, setQuery] = useState({})
  const [chosenState, setChosenState] = useState(currentUser.homeState || states[0])

  useEffect(() => {
    axios.get(`/api/recareas/states/${chosenState.value}`)
      .then(axiosResp => {
        updateRecAreasData(axiosResp.data)
      })
  }, [chosenState])

  function handleChange(selectedOption) {
    setChosenState(selectedOption)
    setQuery({
      ...query,
      state: selectedOption.value
    })
  }

  const getFullStateName = (stateAbbreviation) => states.find(state => state.value === stateAbbreviation).label

  const darkBody = !!document.body.id

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: darkBody ? 'var(--color-grey-blue)' : 'none',
      border: darkBody ? 'none' : '2px solid black',
      margin: '0.5rem 0 1rem'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkBody ? 'var(--color-grey-blue)' : 'rgb(247, 240, 230)'
    }),
    option: (provided, { isFocused }) => ({
      ...provided,
      backgroundColor: isFocused && (darkBody ? 'var(--color-inky-blue)' : 'green'),
      color: isFocused && darkBody && 'hotPink'
    }),
    container: (provided) => ({
      ...provided,
      width: '180px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: darkBody ?  'white' : 'var(--color-grey-blue)'
    })
  }

  if (!recAreasData.length)
    return <div id="loading-container">
      <img className="loading" src={loadingGif} alt="loading" />
      <h2>Loading...</h2>
    </div>


  return <section id="browse">

    <h1>Places of Interest</h1>

    <div className="sort-by-state">
      <p>Sort by US state: </p>

      <Select
        className="dropdown"
        name="state"
        id="state"
        defaultValue={chosenState}
        onChange={handleChange}
        options={states}
        isSearchable
        styles={customStyles}
      />

    </div>

    <Tabs>
      <TabList>
        <Tab>List</Tab>
        <Tab>Map</Tab>
      </TabList>
      <TabPanel>
        <section id="all-tiles">
          {recAreasData.map((recArea, index) => {
            return (
              <Link to={{ pathname: `/recareas/${recArea._id}`, state: { recAreaId: recArea._id } }} key={index}>
                <article className="tile">
                  <h2>{recArea.name}</h2>
                  <div className="rating">
                    <RatingIcons rating={recArea.avgRating} numOfReviews={recArea.reviews.length} color={darkMode ? 'hot-pink' : 'orange'} />
                  </div>
                  <img className="preview-img" src={recArea.media[0].url} alt={recArea.name} />
                  {recArea.city ? <h3>{recArea.city}, {recArea.state}</h3> : <h3>{getFullStateName(recArea.state)}</h3>}
                </article>
              </Link>
            )
          })}
        </section>

      </TabPanel>
      <TabPanel>
        <RecAreaMap chosenState={chosenState} />
      </TabPanel>
    </Tabs>


  </section>
}


