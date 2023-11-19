// src/components/LoginForm/RegisterForm.jsx
import React from 'react';
import './RegisterForm.css'; // Asegúrate de que esta ruta es correcta

const RegisterForm = ({ onRegister, onChange, email, password }) => {
    return (
        <form className="register-form" onSubmit={(e) => onRegister(e, email, password)}>
            <input
                className="register-input"
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email Address"
            />
            <input
                className="register-input"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
            />
            <button className="register-button" type="submit">Signup</button>
        </form>
    );
};

export default RegisterForm;
