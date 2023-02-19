import React, { createContext, useState, useEffect, useContext } from 'react'
import jwt from 'jsonwebtoken'
import Axios from 'axios'

// CURRENT USER CONTEXT

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: !!localStorage.getItem('token'),
    id: jwt.decode(localStorage.getItem('token'))?.sub,
    showWishList: true,
    showVisited: true
  })

  useEffect(() => {
    if (!currentUser.isLoggedIn) return
    Axios.get(`/api/users/${currentUser.id}`)
      .then(response => {
        setCurrentUser({
          ...response.data,
          isLoggedIn: true,
          recAreaWishList: response.data.recAreaWishList.map(site => site._id),
          campgroundWishList: response.data.campgroundWishList.map(site => site._id),
          campgroundsVisited: response.data.campgroundsVisited.map(site => site._id),
          recAreasVisited: response.data.recAreasVisited.map(site => site._id),
          id: response.data._id
        })
        setListDisplayPreferences(response.data)
        updateUserHomeState(response.data.homeState)
      })
      .catch(err => console.log(err))
  }, [currentUser.isLoggedIn])

  const logIn = (data) => {
    localStorage.setItem('token', data.token)
    setCurrentUser({
      ...data,
      isLoggedIn: true,
      showWishList: data.showWishList ?? true,
      showVisited: data.showVisited ?? true
    })
  }

  const logOut = () => {
    localStorage.removeItem('token')
    setCurrentUser({
      ...currentUser,
      isLoggedIn: false,
      firstName: ''
    })
  }

  const toggleListDisplay = (e) => {
    setCurrentUser({
      ...currentUser,
      [e.target.name]: !e.target.checked
    })
  }

  const setListDisplayPreferences = (data) => {
    setCurrentUser({
      ...currentUser,
      showWishList: data.showWishList ?? true,
      showVisited: data.showVisited ?? true
    })
  }

  const updateWishList = (siteWishList, siteId) => {
    if (currentUser[siteWishList].includes(siteId)) {
      setCurrentUser({
        ...currentUser,
        [siteWishList]: currentUser[siteWishList].filter(site => site !== siteId)
      })
    } else {
      setCurrentUser({
        ...currentUser,
        [siteWishList]: [...currentUser[siteWishList], siteId]
      })
    }
  }

  const updateVisited = (siteVisitedList, siteId) => {
    if (currentUser[siteVisitedList].includes(siteId)) {
      setCurrentUser({
        ...currentUser,
        [siteVisitedList]: currentUser[siteVisitedList].filter(site => site !== siteId)
      })
    } else {
      setCurrentUser({
        ...currentUser,
        [siteVisitedList]: [...currentUser[siteVisitedList], siteId]
      })
    }
  }

  const updateUserHomeState = (state) => {
    setCurrentUser({
      ...currentUser,
      homeState: state
    })
  }

  return (
    <UserContext.Provider value={{
      currentUser,
      logIn,
      logOut,
      updateWishList,
      updateVisited,
      toggleListDisplay, 
      updateUserHomeState,
      setListDisplayPreferences
    }}>
      {children}
    </UserContext.Provider>
  )

}


// DARK/LIGHT MODE THEME CONTEXT

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {

  const [darkMode, setDarkMode] = useState(false)
  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      setDarkMode(false)
      implementDarkMode(false)
      return
    }
    Axios
      .get(`/api/users/${currentUser.id}`)
      .then(response => {
        setDarkMode(response.data.darkMode ?? false)
        implementDarkMode(response.data.darkMode)
      })
      .catch(err => console.log(err))
  }, [currentUser.isLoggedIn])

  const toggleDarkModeInContext = (e) => {
    setDarkMode(!e.target.checked)
  }

  const implementDarkMode = (userPref = darkMode) => userPref ? document.body.id = 'dark-mode' : document.body.id = ''

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkModeInContext, implementDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )

}