import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function ResetPassword(){
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            navigate('/login');
        } catch (error) {
            alert('Page Not Found')
        }
    };

    const handleResetPassword = (e) => {
        try {
            axios.post('http://localhost:8000/auth/password-reset/', { email });
            navigate('/reset-sent')
        } catch (err) {
            setEmailError('Пользователь с таким email не зарегистрирован')
        }
    };

    return (
        <div className="login-form">
            <h2> Сброс пароля </h2>
            <form onSubmit={handleResetPassword}>
                <div className="form-group">
                    <label className="form-label"> Введите е-mail </label>
                    {(emailError) && <div style={{color:'#D33F49'}}>{emailError}</div>}
                    <input type="email" className="form-control" name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <button type="submit" className="log-btn"> Отправить </button>
                <div className="remember-link">
                    <a href="{'/login'}" onClick={handleLogin} className="link"> Вспомнили пароль? Войти </a>
                </div>
            </form>
        </div>
    );
}
export default ResetPassword;