import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import MapGL, { Marker, Popup } from 'react-map-gl';

// import MapGL, { Marker, Popup, WebMercatorViewport, FlyToInterpolator } from 'react-map-gl'

//! can change API token and  mapbox account

export const CampgroundMap = () => {
  const [campgroundsData, updateCampgroundsData] = useState([]);
  const [selectedCampground, setSelectedCampground] = useState(null);
  const [viewPort, setViewPort] = useState({
    altitude: 1.5,
    bearing: 0,
    height: '80vh',
    width: '80vw',
    zoom: 7,
    // maxPitch: 60,
    // maxZoom: 24,
    // minZoom: 0,
    // pitch: 0,
    latitude: 37.2761451,
    longitude: -104.6494972,

    // for  fit bounds zoom = 3
  });

  // function calculateBounds(array) {
  //   const values = array.reduce((bounds, location) => {
  //     if (location.latitude > bounds.maxlat) bounds.maxlat = location.latitude
  //     if (location.latitude < bounds.minlat) bounds.minlat = location.latitude
  //     if (location.longitude > bounds.maxlon) bounds.maxlon = location.longitude
  //     if (location.longitude < bounds.minlon) bounds.minlon = location.longitude
  //     return bounds
  //   }, { minlat: 90, maxlat: -90, minlon: 180, maxlon: -180 })
  //   return [[values.minlon, values.minlat], [values.maxlon, values.maxlat]]
  // }

  const [, recAreaId] = useLocation().pathname.match(/\/(\w+)\/(\w+)$/);

  // change to zoomed in for campground props
  // latitude: campgroundsData[0].latitude,
  // longitude: campgroundsData[0].longitude

  useEffect(() => {
    axios
      .get(`/api/recareas/${recAreaId}/campgrounds`)
      .then((axiosResp) => {
        updateCampgroundsData(axiosResp.data);
        // const bounds = calculateBounds(axiosResp.data)

        // const { longitude, latitude, zoom } = new WebMercatorViewport(viewPort).fitBounds(bounds, { padding: 60, offset: [0, -50] })

        setViewPort({
          ...viewPort,
          latitude: axiosResp.data[0].latitude,
          longitude: axiosResp.data[0].longitude,

          // longitude,
          // latitude,
          // zoom,
          // transitionDuration: 3000,
          // transitionInterpolator: new FlyToInterpolator()
        });
      })
      .catch((err) => console.log(err));
  }, [recAreaId]);

  // !could change state for use effect after the click of a button?
  //  ! could activate with with a set interval changing a boolean

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Escape') {
        setSelectedCampground(null);
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const darkBody = !!document.body.id;

  return (
    <section id="map-container">
      <MapGL
        mapboxApiAccessToken={
          darkBody
            ? 'pk.eyJ1IjoiYWxpY25payIsImEiOiJja2Jja2kwMmwwMnM3MnNxZWx2aXR1YjdpIn0.rPq9vNb1zInDizAx_EMXPA'
            : 'pk.eyJ1IjoiemNoYWJlayIsImEiOiJja2NhcDAwdWMxd3h6MzFsbXQzMXVobDh2In0.RIvofanub0AhjJm3Om2_HQ'
        }
        {...viewPort}
        mapStyle={
          darkBody
            ? 'mapbox://styles/alicnik/ckcfm582m09tf1imq1vhqauog'
            : 'mapbox://styles/zchabek/ckcbqjm986dug1kpuzi036e6q'
        }
        onViewportChange={(viewPort) => setViewPort(viewPort)}
      >
        {campgroundsData.map((campground) => {
          return (
            <Marker
              key={campground._id}
              latitude={campground.latitude}
              longitude={campground.longitude}
            >
              <button className="markerButton" onClick={() => setSelectedCampground(campground)}>
                ⛺️
              </button>
            </Marker>
          );
        })}

        {selectedCampground ? (
          <Popup
            closeOnClick={false}
            latitude={selectedCampground.latitude}
            longitude={selectedCampground.longitude}
            onClose={() => setSelectedCampground(null)}
          >
            <Link to={`/campgrounds/${selectedCampground._id}`}>
              <div className="popoutCampground">
                <h3>{selectedCampground.name}</h3>
                <img src={selectedCampground.media[0].url} alt="campground" />
              </div>
            </Link>
          </Popup>
        ) : null}
      </MapGL>
    </section>
  );
};
