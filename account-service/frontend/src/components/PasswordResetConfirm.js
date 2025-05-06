import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { passwordResetConfirm } from '../api';
// import { useNavigate } from "react-router";


export default function PasswordResetConfirm() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [password_check, setPasswordCheck] = useState('');
  const [paswordError, setPaswordError] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(false);
  // const navigate = useNavigate();
  const rePassw = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;

  document.title = "Сброс пароля"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (rePassw.test(password) && password.length >= 8) {
        if (password_check === password) {
          const { data } = await passwordResetConfirm(uid, token, password);
          if (data.message) {
            setAlert(true);
          }
        } else {
          setMessage("Пароли не совпадают");
        }
      } else {
        setPaswordError("Пароль должен содержать как минимум 8 симфолов, одну заглавную букву и цифру");
      }

    } catch {
      alert('Возникла ошибка');
    }
  };
  
  return (
    <div className="login-form">
      <a href="/" className="link">Войти</a>
      <h2> Изменение пароля </h2> 
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label"> Введите новый пароль </label>
        <input name="password" type="password" className="form-control" onChange={e => setPassword(e.target.value)} required />
        <div style={{color:'#D33F49'}}>{ paswordError }</div>
      </div>
      <div className="form-group">
        <label className="form-label"> Повторите пароль </label>
        <input name="password_check" type="password" className="form-control" onChange={e => setPasswordCheck(e.target.value)} required />
      </div>
      <div>
        <button type="submit" className="btn btn-warning">Установить новый пароль</button>
      </div>  
        {message && <div style={{color:'#D33F49'}}>{message}</div>}
        {alert && 
          <div class="alert alert-primary" role="alert">
          Ваш пароль успешно сброшен. <br></br>
          <a href="/" class="alert-link">ВОЙТИ </a>
          </div>
        }
      </form>
    </div>
  );
}
