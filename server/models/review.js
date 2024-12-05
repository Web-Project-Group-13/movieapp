import {pool} from '../helpers/db.js' 

// Lisää arvostelu tietokantaan
const addReview = async (userId, tmdbId, rating, comment,movieTitle,moviePoster) => {
  try {
    const result = await pool.query(
      'INSERT INTO public.reviews (user_id, tmdb_id, stars, comment,movie_title,movie_poster) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, tmdbId, rating, comment,movieTitle,moviePoster]
    );
    return result.rows[0]  // Palauta lisätty arvostelu
  } catch (err) {
    throw new Error('Virhe arvostelun lisäämisessä: ' + err.message)
  }
};

// Hae kaikki arvostelut
const getAllReviews = async () => {
  try {
    const result = await pool.query(
      'SELECT reviews.*, "User".username FROM public.reviews JOIN public."User" ON reviews.user_id = "User".id'
    );
    return result.rows  // Palauta vain arvostelut
  } catch (err) {
    throw new Error('Virhe kaikkien arvostelujen hakemisessa: ' + err.message)
  }
};

export { addReview, getAllReviews };
