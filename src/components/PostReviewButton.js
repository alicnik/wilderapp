import React, { useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { UserContext } from './Context';

export const PostReviewButton = () => {
  const [, siteCollection, siteId] = useLocation().pathname.match(/\/(\w+)\/(\w+)$/);
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  function handleClick() {
    history.push({
      pathname: `/${siteCollection}/${siteId}/postreview`,
      state: { siteCollection, siteId },
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={!currentUser.isLoggedIn}
      title={currentUser.isLoggedIn ? 'Post a review' : 'You must be logged in to post a review'}
    >
      Post a review
    </button>
  );
};
