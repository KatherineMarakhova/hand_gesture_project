import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [usernameTouched, setUsernameTouched] = 'false';
  const [emailTouched, setEmailTouched] = 'false';
  const [passwordTouched, setPasswordTouched] = 'false';
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/auth/api/register/', { username, password, email });
      alert('Registration successful');
      navigate('/home');
    } catch (error) {
      alert('Error during registration');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      navigate('/login');
    } catch (error) {
      alert('Page Not Found');
    }
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value)
    if (e.target.value.length<8) {
      setUsernameError("Логин не может быть короче 8-ми символов")
    }
    else {
      setUsernameError("")
    }
  }

  const emailHandler = (e) => {
    setEmail(e.target.value)
    const reEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!reEmail.test(e.target.value)) {
      setEmailError("Некорректный email")
    }
    else {
      setEmailError("")
    }
  }

  const passwordHandler = (e) => {
    setPassword(e.target.value)
    const rePassw = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;
    if (!rePassw.test(e.target.value) || e.target.value.length <8) {
      setPasswordError("Пароль должен содержать как минимум 8 симфолов, одну заглавную букву и цифру")
    }
    else {
      setPasswordError("")
    }
  }

  const blurHandler = (e) => {
    switch (e.target.value) {
      case 'username':
        setUsernameTouched(true)
        break
      case 'email':
        setEmailTouched(true)
        break
      case 'password':
        setPasswordTouched(true)
        break
      default:
        //pass
    }
  }

  return (
    <div className="login-form">
      <a href="{'/login'}" onClick={handleLogin} className="link login-link">Войти</a>
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">Логин</label>
          {(usernameTouched && usernameError) && <div style={{color:'#D33F49'}}>{usernameError}</div>}
          <input onChange={(e) => usernameHandler(e)} onBlur={e => blurHandler(e)} type="text" className="form-control" value={username} required />
        </div>
        <div className="form-group">

          <label className="form-label">Email</label>
          {(emailTouched && emailError) && <div style={{color:'#D33F49'}}>{emailError}</div>}
          <input onChange={e => emailHandler(e)} onBlur={e => blurHandler(e)} name="email" type="email" className="form-control" value={email} required />

        </div>
        <div className="form-group">

          <label className="form-label">Пароль</label>
          {(passwordTouched && passwordError) && <div style={{color:'#D33F49'}}>{passwordError}</div>}
          <input onChange={e => passwordHandler(e)} onBlur={e => blurHandler(e)} name="password" type="password" className="form-control" value={password} required />

        </div>
        <button type="submit" className="log-btn">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Register;