import React, { useState } from 'react';
import axios from 'axios';
import '../pages/Reviews.css';

const ReviewForm = ({ movieId, movieTitle, moviePoster }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Oletetaan, että JWT on tallennettu localStorageen
      const response = await axios.post('http://localhost:3001/reviews/add', 
        { tmdbId: movieId, rating, comment }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
      alert('Arvostelu lisätty')
      }
    } catch (error) {
      console.error('Virhe arvostelun lisäämisessä:', error);
      alert('Virhe arvostelun lisäämisessä');
    }
  };

  const openModal = () => {setIsModalOpen(true)}
  const closeModal = () => {setIsModalOpen(false)}
  

  return (
    <div>
      <h3>Anna arvotelu elokuvalle {movieTitle}</h3>
      <img src={`https://image.tmdb.org/t/p/w200${moviePoster}`} alt={movieTitle} />
      <button onClick={openModal}>Anna arvostelu</button>

      {isModalOpen && (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
             <h3>{movieTitle}</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tähtiä (1-5)</label>
                    <input type="number" 
                    value={rating} min="1" max="5" 
                    onChange={handleRatingChange} />
                </div>
                <div>
                    <label>Kommentti</label>
                     <textarea value={comment} 
                     onChange={handleCommentChange}>

                     </textarea>
                </div>
                    <button type="submit">Lisää arvostelu</button>
            </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
