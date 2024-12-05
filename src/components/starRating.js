import React from 'react';

const StarRating = ({ rating }) => {
  const stars = [];
  
  // Lisää tähtiä ratingin mukaan (täysi tähti tai tyhjä tähti)
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push('★'); // Täysi tähti
    } else {
      stars.push('☆'); // Tyhjä tähti
    }
  }

  return <span>{stars.join(' ')}</span>; // Näyttää tähtiä
};

export default StarRating;
