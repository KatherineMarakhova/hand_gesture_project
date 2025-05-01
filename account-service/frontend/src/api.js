import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const register = (username, email, password) =>
  axios.post(`${API_URL}register/`, { username, email, password });

export const login = (username, password) =>
  axios.post(`${API_URL}login/`, { username, password });

export const getUser = (token) =>
  axios.get(`${API_URL}user/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const passwordReset = (email) =>
  axios.post(`${API_URL}password-reset/`, { email });

export const passwordResetConfirm = (uid, token, password) =>
  axios.post(`${API_URL}password-reset-confirm/`, {uid, token, new_password: password});
