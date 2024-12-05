import { Router } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUser, deleteUser, selectUserByEmail } from "../models/User.js";

const router = Router();
// Kovakoodattu JWT-avain
const JWT_SECRET = 'mysecretkey';


router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Käyttäjätunnus ja salasana ovat pakollisia.' });
    }

    try {
        // Salasanan hash
        const hashedPassword = await hash(password, 10);

        // Käyttäjän lisääminen tietokantaan
        const result = await insertUser(username, hashedPassword);

        res.status(201).json({
            id: result.rows[0].id,
            username: result.rows[0].username
        });
    } catch (error) {
        console.error('Virhe käyttäjän lisäämisessä:', error);
        next(error); 
    }
});


// Käyttäjän kirjautuminen
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Tarkistetaan, että käyttäjätunnus ja salasana on kirjoitettu
  if (!username || !password) {
    return res.status(400).json({ message: 'Käyttäjätunnus ja salasana ovat pakollisia.' });
  }

  try {
    // Haetaan käyttäjä tietokannasta
    const result = await selectUserByEmail(username);

    // Tarkistetaan, löytyykö käyttäjä
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
    }

    const user = result.rows[0];

    // Tarkistetaan salasanan oikeellisuus
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Virheellinen salasana.' });
    }

    // Luodaan JWT-token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Palautetaan token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Kirjautumisvirhe:', error);
    res.status(500).json({ message: 'Virhe kirjautumisessa.' });
  }
});


// Poista käyttäjä tietokannasta
router.delete('/delete/:username', async (req, res) => {
    try {
      const { username } = req.params;

      // Kutsutaan deleteUser-funktiota, joka poistaa käyttäjän tietokannasta
      const result = await deleteUser(username);
  
       // Jos käyttäjää ei löydy tietokannasta, palautetaan virhe
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
      }
  
      res.status(200).json({ message: 'Käyttäjä poistettu onnistuneesti.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Virhe käyttäjän poistamisessa.' });
    }
  });


export default router;

