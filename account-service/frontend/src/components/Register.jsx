import React, { useState } from 'react';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password_check: '' });
  const [paswordError, setPaswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const reEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const rePassw = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  document.title = "Регистрация"

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setEmailError(reEmail.test(form.email)?"":"Некорректный email")
      if (rePassw.test(form.password) && form.password.length >= 8 && reEmail.test(form.email)) {
        if (form.password_check === form.password) {
          await register(form.username, form.email, form.password);
          alert('Регистрация успешна!');
        } else {
          setPaswordError("Пароли не совпадают")
        }
      } else {
        setPaswordError("Пароль должен содержать как минимум 8 симфолов, одну заглавную букву и цифру")
      }
    } catch {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="login-form">
      <a href="/" className="link">Войти</a>
      <h2> Регистрация </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label"> Логин </label>
          <input name="username" className="form-control" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label"> Email </label>
          <input name="email" className="form-control" onChange={handleChange} required />
          <div style={{color:'#D33F49'}}>{ emailError }</div>
        </div>
        <div className="form-group">
          <label className="form-label"> Пароль </label>
          <input name="password" className="form-control" type="password" onChange={handleChange} required />
          <div style={{color:'#D33F49'}}>{ paswordError }</div>
        </div>
        <div className="form-group">
          <label className="form-label"> Повторите пароль </label>
          <input name="password_check" className="form-control" type="password" onChange={handleChange} required />
        </div>
        <button type="submit" className="log-btn">Зарегистрироваться</button>
      </form>
    </div>
  );
}