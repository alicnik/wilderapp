import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from './Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle as emptyTick } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as wholeTick } from '@fortawesome/free-solid-svg-icons';
import { useParams, useLocation } from 'react-router-dom';
import Axios from 'axios';

export const Visited = () => {
  const { currentUser, updateVisited } = useContext(UserContext);
  const visitedHasChanged = useRef(false);
  const { id: siteId } = useParams();
  const { pathname } = useLocation();
  const collection = pathname.includes('recareas') ? 'recAreasVisited' : 'campgroundsVisited';
  const [hasVisited, setHasVisited] = useState(
    currentUser.campgroundsVisited?.includes(siteId) ||
      currentUser.recAreasVisited?.includes(siteId)
  );

  useEffect(() => {
    if (!visitedHasChanged.current) return;
    const token = localStorage.getItem('token');
    Axios.put(
      `/api/users/${currentUser.id}`,
      { [collection]: siteId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => (visitedHasChanged.current = false))
      .catch((err) => console.log(err));
  });

  const handleClick = () => {
    visitedHasChanged.current = true;
    setHasVisited((previous) => !previous);
    updateVisited(collection, siteId);
  };

  return (
    <FontAwesomeIcon
      onClick={handleClick}
      icon={hasVisited ? wholeTick : emptyTick}
      color="green"
    />
  );
};
