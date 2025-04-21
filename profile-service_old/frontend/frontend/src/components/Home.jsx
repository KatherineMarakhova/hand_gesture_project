import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/api/user/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    navigate('/login');
    try{
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
        } catch (error) {
            navigate('/home');
        }
  };

  return (
    <div className="container mt-5">
      <h2>Home</h2>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    
  );

}

export default Home;