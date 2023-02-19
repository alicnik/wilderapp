import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import loadingGif from '../assets/loading.gif';
import { useLocation, Link } from 'react-router-dom';
import FadeIn from 'react-fade-in';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { SiteList } from './SiteList';
import { ReviewListItem } from './ReviewList';

const possessive = (name) => (/s$/i.test(name) ? `${name}'` : `${name}'s`);

export const OtherUser = () => {
  const [otherUser, setOtherUser] = useState();
  const [, otherUserId] = useLocation().pathname.match(/\/users\/(\w+)$/);

  useEffect(() => {
    Axios.get(`/api/users/${otherUserId}`)
      .then((response) => setOtherUser(response.data))
      .catch((err) => console.log(err));
  }, []);

  if (!otherUser)
    return (
      <div id="loading-container">
        <img className="loading" src={loadingGif} alt="loading" />
        <h2>Loading...</h2>
      </div>
    );

  return (
    <section id="other-user">
      <FadeIn>
        <div className="bio">
          <FadeIn>
            <h1>
              {otherUser.firstName} {otherUser.lastName}
            </h1>
            <img className="user-avatar-img" src={otherUser.avatar} alt="user avatar" />
            {otherUser.bio && (
              <>
                <p>{otherUser.bio}</p>
              </>
            )}
          </FadeIn>
        </div>

        <Tabs>
          <TabList>
            <Tab>{possessive(otherUser.firstName)} Locations</Tab>
            <Tab>{possessive(otherUser.firstName)} Reviews</Tab>
          </TabList>
          <TabPanel>
            <Tabs>
              <TabList>
                <Tab>Wishlist</Tab>
                <Tab>Visited</Tab>
              </TabList>
              <TabPanel>
                {otherUser.recAreaWishList.length || otherUser.campgroundWishList.length ? (
                  <div className="wish-list">
                    {otherUser.recAreaWishList.map((recArea, i) => (
                      <Link
                        to={{
                          pathname: `/recareas/${recArea._id}`,
                          state: { recAreaId: recArea._id },
                        }}
                        key={i}
                      >
                        <SiteList site={recArea} />
                      </Link>
                    ))}
                    {otherUser.campgroundWishList.map((campground, i) => (
                      <Link to={`/campgrounds/${campground._id}`} key={i}>
                        <SiteList site={campground} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>{otherUser.firstName} hasn&apos;t put any places on their wish list yet.</p>
                )}
              </TabPanel>
              <TabPanel>
                {otherUser.recAreasVisited.length || otherUser.campgroundsVisited.length ? (
                  <div className="visited">
                    {otherUser.recAreasVisited.map((recArea, i) => (
                      <Link
                        to={{
                          pathname: `/recareas/${recArea._id}`,
                          state: { recAreaId: recArea._id },
                        }}
                        key={i}
                      >
                        <SiteList key={i} site={recArea} />
                      </Link>
                    ))}
                    {otherUser.campgroundsVisited.map((campground, i) => (
                      <Link to={`/campgrounds/${campground._id}`} key={i}>
                        <SiteList key={i} site={campground} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>{otherUser.firstName} hasn&apos;t put any places on their visited list yet.</p>
                )}
              </TabPanel>
            </Tabs>
          </TabPanel>
          <TabPanel>
            {otherUser.recAreaReviews.length || otherUser.campgroundReviews.length ? (
              <div className="user-reviews">
                <div className="user-rec-area-reviews">
                  {otherUser.recAreaReviews.map((review, i) => (
                    <ReviewListItem
                      key={i}
                      review={review}
                      enableComments={false}
                      displayAvatar={false}
                    />
                  ))}
                </div>
                <div className="campground-reviews">
                  {otherUser.campgroundReviews.map((review, i) => (
                    <ReviewListItem
                      key={i}
                      review={review}
                      enableComments={false}
                      displayAvatar={false}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p>{otherUser.firstName} hasn&apos;t left any reviews yet.</p>
            )}
          </TabPanel>
        </Tabs>
      </FadeIn>
    </section>
  );
};
