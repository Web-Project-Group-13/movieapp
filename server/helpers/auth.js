import jwt from 'jsonwebtoken';

//const { verify } = jwt;

const JWT_SECRET_KEY = '1234'

const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
    // Tarkistetaan, onko Authorization header olemassa
    if (!req.headers.authorization) {
        res.statusMessage = authorizationRequired;
        return res.status(401).json({ message: authorizationRequired });
    }

    try {
        // Haetaan token headerista ja poistetaan 'Bearer ' etuliite
        const token = req.headers.authorization.split(' ')[1];
        
        // Dekoodataan token ja tarkistetaan sen validius
        const decoded = jwt.verify(token,JWT_SECRET_KEY);

        // Lisätään decoded tieto requestin bodyyn, niin se on käytettävissä muissa reiteissä
        req.user = decoded;

        // Jatketaan seuraavaan middlewareen/reittiin
        next();
    } catch (err) {
        res.statusMessage = invalidCredentials;
        return res.status(403).json({ message: invalidCredentials });
    }
};

export { auth };
