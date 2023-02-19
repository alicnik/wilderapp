import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { RatingIcons } from './RatingIcons';
// import { testData } from './helpers'
import Axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CampgroundMap } from './CampgroundMap';
import loadingGif from '../assets/loading.gif';
import FadeIn from 'react-fade-in';
import { ThemeContext } from './Context';

export const Campgrounds = (props) => {
  const { darkMode } = useContext(ThemeContext);
  const [campgroundsData, setCampgroundsData] = useState();
  const [hotelsData, setHotelsData] = useState([]);
  const latitude = props.location.state?.latitude;
  const longitude = props.location.state?.longitude;

  useEffect(() => {
    if (!campgroundsData) {
      const recAreaId = props.location.pathname.match(/recareas\/(\w+)\/campgrounds/)[1];
      Axios.get(`/api/recareas/${recAreaId}/campgrounds`)
        .then((response) => {
          setCampgroundsData(response.data);
        })
        .catch((err) => console.log(err));
      if (!(longitude && latitude)) return;
      Axios.get(
        `https://tripadvisor1.p.rapidapi.com/hotels/list-by-latlng?lang=en_US&limit=10&latitude=${latitude}&longitude=${longitude}`,
        {
          headers: {
            'x-rapidapi-host': 'tripadvisor1.p.rapidapi.com',
            'x-rapidapi-key': process.env.TRIPADVISOR_API_KEY,
          },
        }
      )
        .then((response) => setHotelsData(response.data.data))
        .catch((err) => console.log(err));
    }
  }, []);

  if (campgroundsData?.length === 0) {
    if (!hotelsData.length)
      return (
        <div id="loading-container">
          <img className="loading" src={loadingGif} alt="loading" />
          <h2>Loading...</h2>
        </div>
      );
    return (
      <section id="hotels">
        <FadeIn>
          <h1>
            No campgrounds!<br></br>How about a hotel instead?
          </h1>
          <div className="hotel-tiles">
            {hotelsData.map((hotel, i) => (
              <article key={i} className="hotel-tile">
                <div className="hotel-info">
                  <h2>{hotel.name}</h2>
                  <img src={hotel.photo?.images?.medium.url} alt={hotel.name} />
                  <p className="location">{hotel.location_string}</p>
                  <p className="ranking">{hotel.ranking}</p>
                  <RatingIcons
                    iconStyle="circle"
                    color={darkMode ? 'hot-pink' : 'green'}
                    rating={Number(hotel.rating)}
                    numOfReviews={Number(hotel.num_reviews)}
                  />
                  <p className="price">Price: {hotel.price}</p>
                  <a
                    href={`https://www.tripadvisor.co.uk/Search?q=${hotel.name.replace(
                      /\W+/g,
                      '%20'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button>Find out more</button>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </FadeIn>
      </section>
    );
  }

  if (!campgroundsData) return <h1>Loading...</h1>;

  return (
    <section id="browse">
      <h1>Campgrounds</h1>
      <Tabs>
        <TabList>
          <Tab>List</Tab>
          <Tab>Map</Tab>
        </TabList>
        <TabPanel>
          <section id="all-tiles">
            {campgroundsData.map((campground, index) => {
              return (
                <Link to={`/campgrounds/${campground._id}`} key={index}>
                  <article className="tile">
                    <h2>{campground.name}</h2>
                    <div className="rating">
                      <RatingIcons
                        className="rating"
                        iconStyle="star"
                        color={darkMode ? 'hot-pink' : 'green'}
                        rating={Number(campground.avgRating)}
                        numOfReviews={Number(campground.reviews.length)}
                      />
                    </div>
                    <img
                      className="preview-img"
                      src={campground.media[0].url}
                      alt={campground.name}
                    />
                    <h3>
                      {campground.city}, {campground.state}
                    </h3>
                  </article>
                </Link>
              );
            })}
          </section>
        </TabPanel>
        <TabPanel>
          <CampgroundMap />
        </TabPanel>
      </Tabs>
    </section>
  );
};
