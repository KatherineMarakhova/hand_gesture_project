import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResetSent(){
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            navigate('/login');
        } catch (error) {
            alert('Page Not Found')
        }
    };

    return (
        <div className="reset-sent">
            <h2 className="reset-text">На указанный email была отправлена ссылка для сброса пароля</h2>
            <button onClick={handleLogin} className="btn btn-secondary">Вернуться на страницу авторизации</button>
        </div>
    );
};
export default ResetSent;