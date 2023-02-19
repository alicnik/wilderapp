import React, { useContext, useState } from 'react';
import { UserContext, ThemeContext } from './Context';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { states } from './helpers';

export const Settings = () => {
  const { currentUser, toggleListDisplay, updateUserHomeState } = useContext(UserContext);
  const { darkMode, toggleDarkModeInContext, implementDarkMode } = useContext(ThemeContext);
  const [homeState, setHomeState] = useState(currentUser.homeState?.value || '');
  const history = useHistory();

  function handleSubmit() {
    implementDarkMode();
    const token = localStorage.getItem('token');
    Axios.put(
      `/api/users/${currentUser.id}`,
      {
        showVisited: currentUser.showVisited,
        showWishList: currentUser.showWishList,
        homeState: states.find((state) => state.value === homeState),
        darkMode,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => history.push('/account'))
      .catch((err) => console.log(err));
  }

  function handleChange(e) {
    const choice = states.find((state) => state.value === e.target.value);
    setHomeState(choice.value);
    updateUserHomeState(choice);
  }

  return (
    <section id="settings">
      <p>Dark mode</p>
      <label htmlFor="dark-mode-toggle">
        <input
          onChange={toggleDarkModeInContext}
          checked={!darkMode}
          type="checkbox"
          name="darkMode"
          id="dark-mode-toggle"
        />
        <span className="first-label-span">On</span>
        <span className="second-label-span">Off</span>
      </label>
      <p>Show wish list?</p>
      <label htmlFor="show-wish-list">
        <input
          onClick={toggleListDisplay}
          defaultChecked={!currentUser.showWishList}
          type="checkbox"
          name="showWishList"
          id="show-wish-list"
        />
        <span className="first-label-span">On</span>
        <span className="second-label-span">Off</span>
      </label>
      <p>Show visited locations?</p>
      <label htmlFor="show-visited">
        <input
          onClick={toggleListDisplay}
          defaultChecked={!currentUser.showVisited}
          type="checkbox"
          name="showVisited"
          id="show-visited"
        />
        <span className="first-label-span">On</span>
        <span className="second-label-span">Off</span>
      </label>
      <p>Set home state</p>
      <select
        className="dropdown"
        name="state"
        id="state"
        value={homeState}
        onChange={handleChange}
      >
        <option value="">None</option>
        {states.map((state, i) => (
          <option key={i} value={state.value}>
            {state.label}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Save Settings</button>
    </section>
  );
};
