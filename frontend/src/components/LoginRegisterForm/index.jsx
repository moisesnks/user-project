import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './LoginRegisterForm.css';

import ObtenerInfoPerfil from '../../api/perfil';

const LoginRegisterForm = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register, getToken } = useAuth();
    const navigate = useNavigate();

    // UseEffect para manejar la navegación después del cambio de token
    useEffect(() => {
        const token = getToken();
        if (token) {
            ObtenerInfoPerfil(token, navigate);
        }
    }, [getToken, navigate]);

    const handleButtonClick = () => {
        setIsLoginView(!isLoginView);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoginView) {
            await login(email, password);
        } else {
            await register(email, password);
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
