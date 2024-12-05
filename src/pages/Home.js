import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { XMLParser } from 'fast-xml-parser';



const Home = () => {
  const [query, setQuery] = useState([])
  const [queryTV, setQueryTV] = useState([])
  //const [queryPerson, setQueryPerson] = useState('')
  const [results, setResults] = useState('')
  const [resultsTV, setResultsTV] = useState('')
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');


  useEffect(() => {
   const navbar = document.querySelector('.navbar');
   const splits = document.querySelectorAll('.split');
   if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        splits.forEach(split => {
        split.style.marginTop = `${navbarHeight}px`;
      });
    }
  }, []);


  // Hakee teatterit
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get('https://www.finnkino.fi/xml/TheatreAreas/');
        const parser = new XMLParser();
        const json = parser.parse(response.data);
        setCinemas(json.TheatreAreas.TheatreArea);
      } catch (error) {
        console.error('Error fetching cinemas:', error);
      }
    };
    fetchCinemas();
  }, []);

  // Muuttaa päivämäärän oikeaan formaattiin (dd.mm.yyyy)
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Hakee elokuvat valitusta teatterista ja päivämäärästä
  useEffect(() => {
    const fetchMovies = async () => {
      if (!selectedCinema || !selectedDate) return;

      try {
        const formattedDate = formatDate(selectedDate);
        const response = await axios.get(`https://www.finnkino.fi/xml/Schedule/?area=${selectedCinema}&dt=${formattedDate}`);
        const parser = new XMLParser();
        const json = parser.parse(response.data);

        setMovies(json.Schedule.Shows.Show || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [selectedCinema, selectedDate]);

  const handleCinemaChange = (e) => {
    setSelectedCinema(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const searchMovie = async (query) => {
    const api_key = '775c0d7ee555978a2f19d45471ffa589';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json();
      console.log(data.results)
      setResults(data.results)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  const searchTV = async (queryTV) => {
    const api_key = '775c0d7ee555978a2f19d45471ffa589';
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${queryTV}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json();
      console.log(data.results)
      setResultsTV(data.results)
    } catch (error) {
      console.error('Error fetching TV:', error)
    }
  }
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const movieQuery = typeof query === 'string' ? query.trim() : '';
      const tvQuery = typeof queryTV === 'string' ? queryTV.trim() : '';
  
      if (!movieQuery && !tvQuery) {
        alert('Please enter a search term in at least one box.');
        return;
      }
  
      if (movieQuery) {
        searchMovie(movieQuery);
      }
      if (tvQuery) {
        searchTV(tvQuery);
      }
    }
  };

  return (
    <div>

      <nav class="navbar">
        
        <ul>
          <div>
          <input 
            placeholder="Hae Elokuvia" 
            value={query}
            onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={handleKeyPress}
          />
          <input
            placeholder='Hae TV Sarjoja'
            value={queryTV}
            onChange={(e) => setQueryTV(e.target.value)}
           onKeyDown={handleKeyPress}
           />
           </div>

          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/reviews">Reviews</a></li>
        </ul>
      </nav>

    <div class="split right">
      <h1>Finnkinon elokuvateattereiden näytösajat</h1>
      
      <select value={selectedCinema} onChange={handleCinemaChange}>
        <option value="">Valitse teatteri</option>
        {cinemas.map(cinema => (
          <option key={cinema.ID} value={cinema.ID}>
            {cinema.Name}
          </option>
        ))}
      </select>

      <div>
        <label htmlFor="date">Valitse päivä: </label>
        <input 
          type="date" 
          id="date" 
          value={selectedDate} 
          onChange={handleDateChange} 
        />
      </div>

      {selectedCinema && selectedDate && (
        <>
          <h2>Elokuvat</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {movies.length === 0 ? (
              <li>Ei elokuvia valitulle päivälle.</li>
            ) : (
              movies.map(movie => (
                <li key={movie.ID} 
                  style = {{
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
                >
                  <div class="container">
                    <div class="image">
                      <img 
                        src={movie.Images.EventMediumImagePortrait} 
                        alt={movie.Title} 
                        style={{ width: '200px', height: '300px' }} 
                      />
                    </div>
                    <div class="text">
                    <h3>{movie.Title}</h3>
                    <p>Alkaa: {new Date(movie.dttmShowStart).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>Sali: {movie.TheatreAuditorium}</p>
                    
                    {movie.RatingImageUrl && (
                      <img 
                        src={movie.RatingImageUrl} 
                        alt="Ikäraja" 
                        style={{ width: '30px', height: '30px', marginRight: '10px' }} 
                      />
                    )}
                  </div>
                  </div>
                 
                  
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>

      <div class="split left">
        <h2>Results:</h2>
        {results.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0}}>
            {results.map((movie) => (
              <li
                key={movie.id}
                style = {{
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
                >
                  
                  
                  <div class="container">
                    <div class="image">
                      <img
                       src={'https://image.tmdb.org/t/p/w200/' + movie.poster_path}
                       alt="img"
                      />
                    </div>
                  <div class="text">
                    <div class="text">
                    </div>
                    <h3 style={{ margin: '0 0 10px' }}>{movie.title}</h3>
                    <p style= {{ margin: 0 }}>
                      {movie.overview
                      ? movie.overview
                      : 'No description available'}
                    </p>
                    <h3 class="rating">
                      rating:&nbsp;
                      {movie.vote_average
                      ? movie.vote_average
                      : 'No rating available'}
                    </h3>
                  </div>
                  </div>

                </li>
            ))}
          </ul>
        ) : (
          <p>No movies found. Try searching for something else!</p>
        )}
      </div>

      <div>
        <h2>TV Results:</h2>
        {resultsTV.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0}}>
            {resultsTV.map((tv) => (
              <li
                key={tv.id}
                style = {{
                  border: '1px solid #eee',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
              >
                <h3 style={{ margin: '0 0 10px' }}>{tv.name}</h3>
                <p style= {{ margin: 0 }}>
                  {tv.overview
                  ? tv.overview
                  : 'No description available'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No TV series found. Try searching for something else!</p>
        )}
      </div>


      
    </div>

    
  );
};

export default Home;