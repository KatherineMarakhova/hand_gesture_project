import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from "react-router";


export default function Login({ setToken }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  document.title = "Вход"

  const handleSubmit = async e => {
    e.preventDefault();

      login(form.username, form.password)
      .then((res) => {
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        setToken(res.data.access);
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Ошибка входа:", err);
        alert("Неверный логин или пароль");
      });
  };

  return (
    <div className="login-form">
        <h2> Войти </h2> 
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label"> Логин </label>
                <input name="username" className="form-control" onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="form-label"> Пароль </label>
                <input name="password" className="form-control" type="password" onChange={handleChange} />
            </div>
            <button type="submit" className="log-btn">Войти</button>
        </form>
        <a className="link register-link" href={"/register"}>Зарегистрироваться</a>
        <a className="link forgot-link" href={"/password-reset"}>Забыли пароль?</a>
    </div>
  );
}
