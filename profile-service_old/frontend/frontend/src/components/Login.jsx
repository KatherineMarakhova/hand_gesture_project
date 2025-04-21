import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            navigate('/home');
            const response = await axios.post('http://localhost:8000/login/', { username, password });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

        } catch (err) {
            setLoginError('Неправильный логин или пароль')
        }
    }

    const handleRegister = async(e) => {
        e.preventDefault();
        try {
            navigate('/register');
        } catch (error) {
            alert('Page Not Found');
        }
    };

    const handleForgot = async(e) => {
        e.preventDefault();
        try {
            navigate('/reset-password');
        } catch (error) {
            alert('Page Not Found');
        }
    };

    return (
        <div className="login-form">
            <h2> Войти </h2> 
            <form onSubmit={handleLogin}>
                {(loginError) && <div style={{color:'#D33F49'}}> {loginError} </div>}
                <div className="form-group">
                    <label className="form-label"> Логин </label>
                    <input type="text" className="form-control" name='username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label className="form-label"> Пароль </label>
                    <input type="password" className="form-control" name='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                    
                <button type="submit" className="log-btn"> Войти </button>

                <a href="{'/register'}" onClick={handleRegister} className="link register-link"> Регистрация </a> 
                <a href="{'/reset-password'}" onClick={handleForgot} className="link forgot-link"> Забыли пароль? </a> 
            </form> 
        </div>
        );
    }

    export default Login;