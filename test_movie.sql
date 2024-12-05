CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    tmdb_id INT NOT NULL, -- TMDb-elokuvan ID
    user_id INT NOT NULL, -- Viittaus User-tauluun
    stars INT CHECK (stars >= 1 AND stars <= 5), -- Tähdet (1–5)
    comment TEXT, -- Sanallinen arvostelu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Aikaleima
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "User" (id) ON DELETE CASCADE
);
