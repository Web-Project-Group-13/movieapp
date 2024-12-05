import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register'
import Profile from './pages/Profile'
import Reviews from './pages/Reviews'

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  /*const handleLogout = () => {
    setUser(null);
  };*/

  const username = "testi3@oamk.fi"; // Hae tämä myöhemmin kirjautuneen käyttäjän tiedoista

  return (
    //<Router>
      <Routes>
        {/* Kirjautumissivu */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
          } 
        />

        {/* Rekisteröintisivu */}
        <Route 
          path="/register" 
          element={<Register />}
        />
        {/* Home-sivu */}
        <Route 
          path="/" 
          element={
            user ? <Home /> : <Navigate to="/login" />
          } 
        />

        {/* Julkinen Home ilman kirjautumista */}
        <Route 
          path="/home" 
          element={<Home />} />

        
        <Route 
          path="/profile" 
          element={<Profile username={username} />} />

        <Route
          path="/reviews"
          element={<Reviews />} />
      </Routes>
    //</Router>
  );
}

export default App;