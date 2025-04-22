import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password_check: '' });
  const [paswordError, setpaswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  document.title = "Регистрация"

  const handleSubmit = async e => {
    e.preventDefault();
    try {
        if (form.password_check === form.password) {
            await register(form.username, form.email, form.password);
            alert('Регистрация успешна!');
            navigate("/login");
        } else {
            setpaswordError("Пароли не совпадают")
        }
      
    } catch {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="login-form">
      <h2> Регистрация </h2> 
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label"> Логин </label>
          <input name="username" className="form-control" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label"> Email </label>
          <input name="email" className="form-control" onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label className="form-label"> Пароль </label>
          <input name="password" className="form-control" type="password" onChange={handleChange} />
        </div>
        <div className="form-group">
          <div style={{color:'#D33F49'}}>{ paswordError }</div>
          <label className="form-label"> Повторите пароль </label>
          <input name="password_check" className="form-control" type="password" onChange={handleChange} />
        </div>
        <button type="submit" className="log-btn">Зарегистрироваться</button>
      </form>
    </div>
  );
}