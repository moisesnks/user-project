// src/components/LoginForm/index.jsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../context/AuthContext';
import './LoginRegisterForm.css'; // Importación de estilos

const LoginRegisterForm = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();

    const handleButtonClick = () => {
        setIsLoginView(!isLoginView);
    };

    const handleSubmit = (e, email, password) => {
        e.preventDefault();
        if (isLoginView) {
            login(email, password);
        } else {
            register(email, password);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    return (
        <div className="login-register-container">
            <div className="login-register-card">
                <div className="slide-button-container">
                    <button
                        className={`slide-button ${isLoginView ? 'active' : ''}`}
                        onClick={handleButtonClick}
                    >
                        Login
                    </button>
                    <button
                        className={`slide-button ${!isLoginView ? 'active' : ''}`}
                        onClick={handleButtonClick}
                    >
                        Signup
                    </button>
                </div>
                {isLoginView ? (
                    <LoginForm onLogin={handleSubmit} onChange={handleChange} email={email} password={password} />
                ) : (
                    <RegisterForm onRegister={handleSubmit} onChange={handleChange} email={email} password={password} />
                )}
            </div>
        </div>
    );
};

export default LoginRegisterForm;
