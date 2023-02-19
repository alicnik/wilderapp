import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers'
import axios from 'axios'

import { StarRating } from './StarRating'
import StatusAlert, { StatusAlertService } from 'react-status-alert'
import 'react-status-alert/dist/status-alert.css'

const reviewSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  dateVisited: Yup.string(),
  text: Yup.string().required('Please provide a review')
})

export const PostReview = (props) => {

  const [rating, setRating] = useState(props.location.state?.rating)
  const [, siteCollection, siteId] = useLocation().pathname.match(/\/(\w+)\/(\w+)\/postreview$/)
  const sitePage = `/${siteCollection}/${siteId}`
  const history = useHistory()
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(reviewSchema),
    criteriaMode: 'all'
  })

  const onSubmit = values => {
    if (!rating) return StatusAlertService.showWarning('Please enter a star rating')
    values.rating = rating
    const token = localStorage.getItem('token')
    axios.post(`/api${sitePage}/reviews`, values, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        history.push(sitePage)
      })
      .catch(err => console.log(err.response))
  }

  return (
    <section id="post-review" >
      <StatusAlert/>
      <h1>Submit a review</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title">Review title</label>
        <input required type="text" id="title" name="title" autoComplete="off" ref={register} />
        <p>{errors.title?.message}</p>
        <StarRating rating={rating} setRating={setRating} name='rating' />
        <label htmlFor="dateVisited">When did you visit?</label>
        <input name="dateVisited" type="date" ref={register}/>
        <label htmlFor="review">What do you want to say?</label>
        <textarea required cols="35" rows="10" name="text" ref={register}></textarea>
        <p>{errors.review?.message}</p>
        <button type="submit">Submit</button>
      </form>  
    </section>
  )
}
