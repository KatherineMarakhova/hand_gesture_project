import React, { useState } from 'react';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password_check: '' });
  const [paswordError, setpaswordError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
        if (form.password_check === form.password) {
            await register(form.username, form.email, form.password);
            alert('Регистрация успешна!');
        } else {
            setpaswordError("Пароли не совпадают")
        }
      
    } catch {
      alert('Ошибка регистрации');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      {/* {(form.password.length === form.password_check.length && form.password !== form.password_check)?(<div style={{color:'#D33F49'}}>Пароли не совпадают</div>) : (<div></div>)} */}
      <div style={{color:'#D33F49'}}>{ paswordError }</div>
      <input name="password_check" type="password" onChange={handleChange} placeholder="Submit Password" />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}