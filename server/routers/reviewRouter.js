import express from 'express';
import { addReview, getAllReviews } from '../models/review.js'
//import { auth } from '../helpers/auth.js'; // Varmistaa, että käyttäjä on kirjautunut


const router = express.Router();

// Reitti arvostelun lisäämiseen
router.post('/add', async (req, res) => {
  const { tmdbId, rating, comment,movieTitle,moviePoster } = req.body;
 const userId = 1 // Saamme käyttäjän ID:n auth middlewaresta

  if (!tmdbId || !rating || !movieTitle || !moviePoster) {
    return res.status(400).json({ message: 'Elokuvan ID ja arvosana ovat pakollisia' });
  }

  try {
    const review = await addReview(userId, tmdbId, rating, comment,movieTitle,moviePoster);
    res.status(201).json(review); // Palautetaan lisätty arvostelu
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reitti kaikkien arvostelujen hakemiseen
router.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews); // Palautetaan kaikki arvostelut
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
