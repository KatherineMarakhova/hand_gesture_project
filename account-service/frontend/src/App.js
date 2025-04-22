import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); 
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            !token ? <Login setToken={setToken} /> : < Navigate to="/profile"/>} />
        <Route
          path="/profile"
          element={
            token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
        <Route path="/register" element={<Register />}/>

        {/* Другие маршруты */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
