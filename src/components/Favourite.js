import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from './Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as emptyHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as wholeHeart } from '@fortawesome/free-solid-svg-icons';
import { useParams, useLocation } from 'react-router-dom';
import Axios from 'axios';

export const Favourite = () => {
  const { currentUser, updateWishList } = useContext(UserContext);
  const favouriteHasChanged = useRef(false);
  const { id: siteId } = useParams();
  const { pathname } = useLocation();
  const collection = pathname.includes('recareas') ? 'recAreaWishList' : 'campgroundWishList';
  const [isFavourite, setIsFavourite] = useState(
    currentUser.camproundWishList?.includes(siteId) || currentUser.recAreaWishList?.includes(siteId)
  );

  useEffect(() => {
    if (!favouriteHasChanged.current) return;
    const token = localStorage.getItem('token');
    Axios.put(
      `/api/users/${currentUser.id}`,
      { [collection]: siteId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => (favouriteHasChanged.current = false))
      .catch((err) => console.log(err));
  });

  const handleClick = () => {
    favouriteHasChanged.current = true;
    setIsFavourite((previous) => !previous);
    updateWishList(collection, siteId);
  };

  return (
    <FontAwesomeIcon
      onClick={handleClick}
      icon={isFavourite ? wholeHeart : emptyHeart}
      color="red"
    />
  );
};
