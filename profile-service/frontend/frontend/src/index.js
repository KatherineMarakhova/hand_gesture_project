import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/base.css'


const API_URL = "http://127.0.0.1:8000/users";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export{API_URL}