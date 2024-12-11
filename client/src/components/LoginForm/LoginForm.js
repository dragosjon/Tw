import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import './LoginForm.css';
import axios from 'axios';

function LoginForm() {
    const [name, setName] = useState(''); // Modificat de la username la name
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                name, // Modificat de la username la name
                password
            });
            login(response.data.token); // Actualizați starea de autentificare
            setMessage('Autentificare reușită!'); // Mesaj de succes
        } catch (error) {
            console.error('Eroare la autentificare', error);
            setMessage('Eroare la autenficare'); // Mesaj de eroare
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {message && <div className="alert alert-info">{message}</div>} {/* Afișează mesajul */}
            <div className="form-group">
                <label htmlFor="name">Nume:</label> {/* Modificat de la Username la Nume */}
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Parolă:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="login-button">Login</button>
        </form>
    );
}

export default LoginForm;
