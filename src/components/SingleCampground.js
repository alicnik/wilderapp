import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock as checkInTime, faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faDog as petsAllowed,
  faClock as checkOutTime,
  faCarSide,
} from '@fortawesome/free-solid-svg-icons';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Carousel } from 'react-responsive-carousel';
import { parseHtml } from './helpers';

import { ReviewListItem } from './ReviewList';
import { PostReviewButton } from './PostReviewButton';
import { StarRating } from './StarRating';
import { RatingIcons } from './RatingIcons';
import { UserContext, ThemeContext } from './Context';
import { Favourite } from './Favourite';
import { Visited } from './Visited';
import { Contact } from './Contact';
import loadingGif from '../assets/loading.gif';
import FadeIn from 'react-fade-in';

export const SingleCampground = () => {
  const [campground, setCampground] = useState();
  const { currentUser } = useContext(UserContext);
  const { darkMode } = useContext(ThemeContext);
  const [, siteCollection, siteId] = useLocation().pathname.match(/\/(\w+)\/(\w+)$/);
  const attributeIcons = { petsAllowed, checkInTime, checkOutTime };

  useEffect(() => {
    Axios.get(`/api/campgrounds/${siteId}`)
      .then((response) => setCampground(response.data))
      .catch((error) => console.log(error));
  }, [siteId]);

  function reviewViaStarRating(e) {
    history.push({
      pathname: `/${siteCollection}/${siteId}/postreview`,
      state: { siteCollection, siteId, rating: e },
    });
  }

  if (!campground)
    return (
      <div id="loading-container">
        <img className="loading" src={loadingGif} alt="loading" />
        <h2>Loading...</h2>
      </div>
    );

  return (
    <section id="single-site" className="single-campground">
      <FadeIn>
        <div className="site-info campground-info">
          <h1>{campground.name}</h1>

          <div className="site-review-header">
            {campground.reviews.length >= 1 ? (
              <>
                {currentUser.isLoggedIn ? (
                  <StarRating rating={campground.avgRating} setRating={reviewViaStarRating} />
                ) : (
                  <RatingIcons rating={campground.avgRating} showNumOfReviews={false} />
                )}
                <p>
                  Rating: {campground.avgRating} ({campground.reviews.length})
                </p>
              </>
            ) : (
              <div className="no-reviews">
                <FontAwesomeIcon icon={faQuestionCircle} color={darkMode ? 'hotPink' : 'green'} />
                <p>
                  No reviews yet.&nbsp;
                  {currentUser.isLoggedIn && (
                    <Link
                      to={{
                        pathname: `/${siteCollection}/${siteId}/postreview`,
                        state: { siteCollection, siteId },
                      }}
                    >
                      Leave a review.
                    </Link>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="carousel-container">
            <Carousel autoplay dynamicHeight showThumbs={false}>
              {campground.media.map((image, i) => (
                <img key={i} src={image.url} alt={image.title} />
              ))}
            </Carousel>
          </div>

          <div
            className="wish-list-visited-container"
            style={{ display: currentUser.isLoggedIn ? 'flex' : 'none' }}
          >
            {currentUser.isLoggedIn && (
              <>
                <p>Add to wishlist</p> <Favourite />
                <p>Mark as visited</p> <Visited />{' '}
              </>
            )}
          </div>

          <div className="campground-attributes">
            {
              <>
                <FontAwesomeIcon icon={faCarSide} color="green" />
                <p>
                  <strong>Accessible by car?</strong> {campground.accessible ? 'Yes' : 'No'}
                </p>
              </>
            }
            {campground.attributes.map((attribute, i) => {
              return (
                <div key={i} className="single-attribute">
                  <FontAwesomeIcon icon={attributeIcons[attribute.name]} color="green" />
                  <p>
                    <strong>{attribute.description}</strong>:{' '}
                    {attribute.value === 'true'
                      ? 'Yes'
                      : attribute.value === 'false'
                      ? 'No'
                      : attribute.value}
                  </p>
                </div>
              );
            })}
          </div>

          <Tabs>
            <TabList>
              <Tab>Info</Tab>
              <Tab>Reviews</Tab>
            </TabList>
            <TabPanel>
              <div className="accordion-container">
                <article className="description">
                  <h2>Description</h2>
                  {parseHtml(campground.description)}
                </article>
              </div>
              <Contact site={campground} />
            </TabPanel>
            <TabPanel>
              <div className="reviews">
                {campground.reviews.length ? (
                  campground.reviews.map((review, i) => (
                    <ReviewListItem key={i} review={review} siteCollection="campgrounds" />
                  ))
                ) : (
                  <p style={{ marginTop: '1rem' }}>No reviews yet.</p>
                )}
                <PostReviewButton />
                {!currentUser.isLoggedIn && (
                  <p className="post-review-button-note">
                    You must be logged in to leave a review.
                  </p>
                )}
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </FadeIn>
    </section>
  );
};
