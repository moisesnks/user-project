// src/components/LoginForm/index.jsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../context/AuthContext';

const LoginRegisterForm = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();

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
        <div className="login-container">
            <div className="login-card">
                <div className="toggle-buttons">
                    <button className={`toggle-button ${isLoginView ? 'active' : ''}`} onClick={() => setIsLoginView(true)}>Login</button>
                    <button className={`toggle-button ${!isLoginView ? 'active' : ''}`} onClick={() => setIsLoginView(false)}>Signup</button>
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
