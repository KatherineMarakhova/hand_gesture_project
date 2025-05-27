import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import PasswordReset from './components/PasswordReset';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login setToken={setToken} />} />
            <Route
            path="/profile"
            element={
                token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/" />
                }
            />
            <Route path="/register" element={<Register />}/>
            <Route path="/password-reset" element={<PasswordReset />}/>
            <Route path="/password-reset-confirm/:uid/:token" element={<PasswordResetConfirm />}/>
          </Routes>
        </BrowserRouter>
  );
}

export default App;
