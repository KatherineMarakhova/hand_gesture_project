import React, { useState } from 'react';
import { login } from '../api';


export default function Login({ setToken }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  document.title = "Вход"

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await login(form.username, form.password);
      setToken(data.access);
      localStorage.setItem('token', data.access);
    } catch {
      alert('Ошибка входа');
    }
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
