import React from 'react'
import Ratings from 'react-ratings-declarative'


// rating prop will be state in parent postreview?
export const StarRating = ({ rating, setRating = f => f }) => {

  return ( 
    <Ratings
      rating={rating}
      changeRating={setRating}
      widgetRatedColors={document.body.id === 'dark-mode' ? 'hotPink' : 'orange'}
    >
      <Ratings.Widget />
      <Ratings.Widget />
      <Ratings.Widget />
      <Ratings.Widget />
      <Ratings.Widget />
    </Ratings>
  ) 
}


