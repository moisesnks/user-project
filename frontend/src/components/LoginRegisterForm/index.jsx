import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../context/AuthContext';
import './LoginRegisterForm.css'; // Importación de estilos

import ObtenerInfoPerfil from '../../api/perfil';

const LoginRegisterForm = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register, getToken } = useAuth();

    const handleButtonClick = () => {
        setIsLoginView(!isLoginView);
    };

    const handleSubmit = async (e, email, password) => {
        e.preventDefault();
        if (isLoginView) {
            await login(email, password); // Espera a que se complete el inicio de sesión
        } else {
            await register(email, password); // Espera a que se complete el registro
        }

        // Después del incio de sesión o registro, obtener el token
        const token = getToken();

        // Llama a ObtenerInfoPerfil pasando el token
        ObtenerInfoPerfil(token);
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
