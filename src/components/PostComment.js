import React, { useState, useEffect } from 'react'
import { useHistory, Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as Yup from 'yup'
import axios from 'axios'
import Axios from 'axios'

const commentSchema = Yup.object().shape({
  text: Yup.string()
    .required('*This field is required')
})

export const PostComment = (props) => {

  const history = useHistory()
  const reviewId = useLocation().pathname.match(/\/reviews\/(\w+)\/postcomment$/)[1]
  const [previousPage, setPreviousPage] = useState( props.location.state?.previousPage )
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(commentSchema)
  })

  useEffect(() => {
    Axios.get(`/api/reviews/${reviewId}`)
      .then(response => {
        const { recAreaRef, campgroundRef } = response.data
        const path = recAreaRef ? `recareas/${recAreaRef}` : `campgrounds/${campgroundRef}`
        setPreviousPage(path)
      })
      .catch(err => console.log('Error:', err))
  }, [previousPage])

  const onSubmit = values => {
    const token = localStorage.getItem('token')
    axios.post(`/api/reviews/${reviewId}/comments`, values, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        history.push(`/${previousPage}`)
      })
      .catch(err => console.log(err))
  }

  return (
    <section id="post-comment">
      <h1>Add comment</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="text">What would you like to say?</label>
        <textarea required cols="30" rows="10" name='text' ref={register} />
        <p>{errors.comment?.message}</p>
        <div className="buttons">
          <button type="submit">Submit</button>
          <Link to={`/${previousPage}`} ><button>Cancel</button></Link>
        </div>
      </form>
    </section>
  )
}