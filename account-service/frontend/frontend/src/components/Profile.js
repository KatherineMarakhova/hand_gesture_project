import React, { useEffect, useState } from 'react';
import { getUser } from '../api';

export default function Profile({ token, onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      getUser(token).then(res => setUser(res.data));
    }
  }, [token]);

  if (!user) return <div>Загрузка...</div>;
  return <div>
    Привет, {user.username}!
    <button onClick={onLogout}>Выйти</button>
    </div>;
}