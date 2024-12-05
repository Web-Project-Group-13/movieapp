import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/starRating.js';

const ReviewList = ({reviews}) => {
  
  return (
    <div>
      <h2>Arvostelut</h2>
      <ul>
        {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
          <li key={review.id}>
            <h4>Elokuva:{review.movie_title}</h4>
            {review.movie_poster && (
            <img 
              src={`https://image.tmdb.org/t/p/w200${review.movie_poster}`} 
              alt={review.movie_title} 
              />
            )}
            <p>Tähdet: <StarRating rating={review.stars}/></p>
            <p>Kommentti: {review.comment}</p>
            <p>Sähköposti: {review.username}</p>
            <p>Aikaleima: {new Date(review.created_at).toLocaleString()}</p>
          </li>
            ))
        ) : (
            <p>Ei arvosteluja</p>
        )}
      </ul>
    </div>
  );
};

export default ReviewList;
