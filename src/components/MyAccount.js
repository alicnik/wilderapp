import React, { useEffect, useContext, useState } from 'react';
import Axios from 'axios';
import { UserContext } from './Context';
import { Link } from 'react-router-dom';
import { ReviewListItem } from './ReviewList';
import { SiteList } from './SiteList';
import { Settings } from './Settings';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FadeIn from 'react-fade-in';
import loadingGif from '../assets/loading.gif';

export const MyAccount = () => {
  const { currentUser, setListDisplayPreferences } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState();
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    Axios.get(`/api/users/${currentUser.id}`).then((response) => {
      setUserDetails(response.data);
      setListDisplayPreferences(response.data);
    });
  }, []);

  useEffect(() => {
    if (!avatar) return;
    Axios.put(
      `/api/users/${currentUser.id}`,
      { avatar },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) =>
        setUserDetails({
          ...userDetails,
          avatar: response.data.avatar,
        })
      )
      .catch((err) => console.log(err));
  }, [avatar]);

  function handleAvatarClick() {
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: 'wilderness',
          uploadPreset: 'wild_app',
          cropping: true,
          croppingAspectRatio: 1,
          googleApiKey: process.env.GOOGLE_IMAGE_SEARCH_API_KEY,
        },
        (err, result) => {
          setAvatar(result.info.secure_url);
        }
      )
      .open();
  }

  function handleBioClick(e) {
    e.preventDefault();
    Axios.put(
      `/api/users/${currentUser.id}`,
      { bio },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => {
        setUserDetails({
          ...userDetails,
          bio: response.data.bio,
        });
        setEditingBio(false);
      })
      .catch((error) => console.log(error));
  }

  if (!userDetails)
    return (
      <div id="loading-container">
        <img className="loading" src={loadingGif} alt="loading" />
        <h2>Loading...</h2>
      </div>
    );

  return (
    <section id="my-account">
      <FadeIn>
        <div className="bio">
          <h1>My Account</h1>
          <h2>
            {userDetails.firstName} {userDetails.lastName}
          </h2>
          <img className="user-avatar-img" src={userDetails.avatar} alt="user avatar" />
          <p onClick={handleAvatarClick} className="link">
            Change avatar
          </p>
          <h3>My bio:</h3>
          <div className="bio-options">
            {userDetails.bio ? (
              <>
                <p>{userDetails.bio}</p>
                <span className="link" onClick={() => setEditingBio(true)}>
                  Edit bio
                </span>
              </>
            ) : (
              <p>
                No bio yet . . . &nbsp;
                <span className="add-bio" onClick={() => setEditingBio(true)}>
                  add one
                </span>
              </p>
            )}
            {editingBio && (
              <form>
                <label htmlFor="edit-bio">Edit your bio here</label>
                <br></br>
                <textarea
                  id="edit-bio"
                  name="bio"
                  value={bio}
                  cols="30"
                  rows="7"
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <br></br>
                <button onClick={handleBioClick}>Save</button>
              </form>
            )}
          </div>
        </div>

        <Tabs>
          <TabList>
            <Tab>Locations</Tab>
            <Tab>My Reviews</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanel>
            <Tabs>
              <TabList>
                <Tab>Wishlist</Tab>
                <Tab>Visited</Tab>
              </TabList>
              <TabPanel>
                {currentUser.showWishList ? (
                  <>
                    <h3 className="account-tab-title">Places I want to go:</h3>
                    <div className="all-tiles">
                      {userDetails.recAreaWishList.length ||
                      userDetails.campgroundWishList.length ? (
                        <div className="wish-list">
                          {userDetails.recAreaWishList.map((recArea, i) => (
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
                          {userDetails.campgroundWishList.map((campground, i) => (
                            <Link to={`/campgrounds/${campground._id}`} key={i}>
                              <SiteList site={campground} />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p>
                          You haven&apos;t put any places on your wish list yet. Just click on the
                          heart to add a recreational area or campground to your list.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>
                    Turn on &lsquo;Show wish list&lsquo; in settings if you want to see anything
                    here!
                  </p>
                )}
              </TabPanel>
              <TabPanel>
                {currentUser.showVisited ? (
                  <>
                    <h3 className="account-tab-title">Places I&apos;ve been:</h3>
                    <div className="all-tiles">
                      {userDetails.recAreasVisited.length ||
                      userDetails.campgroundsVisited.length ? (
                        <div className="visited">
                          {userDetails.recAreasVisited.map((recArea, i) => (
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
                          {userDetails.campgroundsVisited.map((campground, i) => (
                            <Link to={`/campgrounds/${campground._id}`} key={i}>
                              <SiteList key={i} site={campground} />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p>
                          You haven&apos;t marked any places as visited yet. Just click on the tick
                          to add a recreational area or campground to your list of visited places.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>
                    Turn on &lsquo;Show visited locations&lsquo; in settings if you want to see
                    anything here!
                  </p>
                )}
              </TabPanel>
            </Tabs>
          </TabPanel>
          <TabPanel>
            {userDetails.recAreaReviews.length || userDetails.campgroundReviews.length ? (
              <div className="my-reviews">
                <div className="rec-area-reviews">
                  {userDetails.recAreaReviews.map((review, i) => (
                    <ReviewListItem
                      key={i}
                      review={review}
                      displayName={false}
                      enableComments={false}
                      displayAvatar={false}
                    />
                  ))}
                </div>
                <div className="campground-reviews">
                  {userDetails.campgroundReviews.map((review, i) => (
                    <ReviewListItem
                      key={i}
                      review={review}
                      displayName={false}
                      enableComments={false}
                      displayAvatar={false}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p>
                You haven&apos;t left any reviews yet. Why not add one for somewhere you&apos;ve
                been?
              </p>
            )}
          </TabPanel>
          <TabPanel>
            <Settings />
          </TabPanel>
        </Tabs>
      </FadeIn>
    </section>
  );
};
