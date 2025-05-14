import React, { useState } from 'react';
import { passwordReset } from '../api';


export default function PasswordReset() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const reEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    document.title = "Сброс пароля"

    const handleSubmit = async (e) => {
      e.preventDefault();
      setEmailError(reEmail.test(email)?"":"Некорректный email")
      if (reEmail.test(email)) {
          const data = await passwordReset(email);
          setMessage(data['data']['message']);
      }
    };

    return (
      <div className="login-form">
        <a href="/" className="link">Войти</a>
        <h2> Сбросить пароль </h2> 
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div>{ message }</div>
            <label className="form-label"> Введите email </label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            <div style={{color:'#D33F49'}}>{ emailError }</div>
          </div>
          <button type="submit" className="log-btn">Сбросить пароль</button>
          
        </form>
      </div>
    );
  }
