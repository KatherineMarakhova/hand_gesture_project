import axios from 'axios';
import axiosInstance from "./utils/axiosInstance";

const API_URL = 'http://localhost:8000/api/';

export const register = (username, email, password) =>
  axios.post(`${API_URL}register/`, { username, email, password });

export const login = (username, password) => {
  return axios.post("http://localhost:8000/api/token/", {
    username,
    password,
  });
};

export const getUser = () => {
  return axiosInstance.get("/api/user/");
};

export const passwordReset = (email) =>
  axios.post(`${API_URL}password-reset/`, { email });

export const passwordResetConfirm = (uid, token, password) =>
  axios.post(`${API_URL}password-reset-confirm/`, {uid, token, new_password: password});
