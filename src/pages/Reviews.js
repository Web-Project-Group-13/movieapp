import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import ReviewList from '../components/reviewList.js';
import './Reviews.css';


const ReviewPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  const API_KEY = '775c0d7ee555978a2f19d45471ffa589';

  // Hae arvostelut backendistä
  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reviews');
      if (Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        console.error('API ei palauta taulukkoa.');
      }
    } catch (error) {
      console.error('Virhe arvostelujen hakemisessa:', error.message);
    }
  };

  // Hae arvostelut komponentin latautuessa
  useEffect(() => {
    fetchReviews();
  }, []);

  // Haetaan elokuvat hakusanalla
  useEffect(() => {
    if (searchTerm) {
      axios
        .get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`)
        .then((response) => {
          setMovies(response.data.results);
        })
        .catch((error) => {
          console.error('Elokuvahaku epäonnistui', error);
        });
    }
  }, [searchTerm]);

  // Lomakkeen lähettäminen
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Lähetetään arvostelu', {rating, comment,selectedMovie});

    try {
        const response =await axios.post('http://localhost:3001/reviews/add', 
            {
                tmdbId: selectedMovie.id,
                rating,
                comment,
                movieTitle: selectedMovie.title,
                moviePoster: selectedMovie.poster_path
    },
    {
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
    })
        console.log('Arvostelu tallennettu', response.data)
        
        //Lisää arvostelu suoraan listaan
        fetchReviews();
        
        //Tyhjennä lomake
        setSelectedMovie(null)
        setRating(1)
        setComment('')
        
      }catch (error) {
        console.error('Arvostelun tallennus epäonnistui', error);
      };
  }

  return (
    <div>
        <nav className="navbar">
            <Link to="/home">Home</Link>
            <Link to="/profile">Profile</Link>
            </nav>
    
    <div className="review-page">
      <h1>Arvostele Elokuvat</h1>
    <div className="search-container">
      <input
        type="text"
        placeholder="Hae elokuvia"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      </div>

      <div className="movie-list">
        {!selectedMovie && (
            <>
        <h2>Löydetyt elokuvat</h2>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h3>{movie.title}</h3>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <button onClick={() => {
                setSelectedMovie(movie)
                setMovies([])
                setSearchTerm('')
            }}
                >
                    Valitse elokuva
                    </button>
            </div>
          ))
        ) : (
          <p>Ei löytynyt elokuvia</p>
        )}
        </>
        )}
      </div>

      {selectedMovie && (
        <div className="review-form-containen">
          <h2 className="form-title">Anna arvostelu elokuvalle: {selectedMovie.title}</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="rating" className="form-label">Arvosana (1–5):</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="form-select"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comment" className="form-label">Kommentti:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Kirjoita mielipiteesi tästä elokuvasta..."
                className="form-textarea"
              />
            </div>
            <button type="submit" className="form-submit-button">Lähetä arvostelu</button>
          </form>
        </div>
      )}

      <ReviewList reviews={reviews} />
    </div>
    </div>
  );
};

export default ReviewPage
