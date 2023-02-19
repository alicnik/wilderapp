import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RatingIcons } from './RatingIcons';
import { timeFrom, dateFrom } from './helpers';
import { UserContext } from './Context';

export const ReviewListItem = ({
  review,
  displayName = true,
  displayAvatar = true,
  enableComments = true,
}) => {
  const location = useLocation().pathname;
  const { currentUser } = useContext(UserContext);

  return (
    <article id="review-container">
      <header className="review-header">
        <div className="review-avatar">
          {displayAvatar ? (
            <img src={review.user.avatar} alt="user avatar" />
          ) : (
            <img
              src={review.recAreaRef?.media[0]?.url || review.campgroundRef?.media[0]?.url}
              alt={review.recAreaRef?.name || review.campgroundRef?.name}
            />
          )}
        </div>
        <div className="review-meta-info">
          {displayName && (
            <Link to={`/users/${review.user._id}`}>
              <p className="reviewer">
                <strong>
                  {review.user.firstName} {review.user.lastName}
                </strong>
              </p>
            </Link>
          )}
          {displayAvatar || review.recAreaRef ? (
            <Link to={`/recareas/${review.recAreaRef?._id}`}>
              <h3>{review.recAreaRef?.name}</h3>
            </Link>
          ) : (
            <Link to={`/campgrounds/${review.campgroundRef?._id}`}>
              <h3>{review.campgroundRef?.name}</h3>
            </Link>
          )}
          <p>{dateFrom(review.createdAt)}</p>
          <RatingIcons rating={review.rating} showNumOfReviews={false} />
        </div>
      </header>

      <div className="review-content">
        <h4>{review.title}</h4>
        <p>{review.text}</p>

        {enableComments && (
          <div className="comments">
            {review.comments.length >= 1 && <h5>Comments:</h5>}
            {review.comments.map((comment, i) => (
              <div className="comment" key={i}>
                <p className="comment-meta-info">
                  {comment.user.firstName || comment.user.username} at {timeFrom(comment.createdAt)}{' '}
                  on {dateFrom(comment.createdAt)}
                </p>
                <p>{comment.text}</p>
              </div>
            ))}
            <Link
              to={{
                pathname: `/reviews/${review._id}/postcomment`,
                state: { reviewId: review._id, previousPage: location },
              }}
            >
              {currentUser.isLoggedIn && <h6>Add comment</h6>}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};
