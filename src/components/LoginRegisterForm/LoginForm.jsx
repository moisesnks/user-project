// src/components/LoginForm/LoginForm.jsx
import React from 'react';
import './LoginForm.css'; // Asegúrate de que esta ruta es correcta

const LoginForm = ({ onLogin, onChange, email, password }) => {
    return (
        <form className="login-form" onSubmit={(e) => onLogin(e, email, password)}>
            <input
                className="login-input"
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email Address"
            />
            <input
                className="login-input"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
            />
            <a href="#" className="link">Forgot password?</a>
            <button className="login-button" type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
