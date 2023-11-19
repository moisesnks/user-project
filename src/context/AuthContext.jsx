// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Aquí deberías añadir la lógica para verificar las credenciales.
        // Por ejemplo, podrías llamar a una API y, en base a la respuesta, establecer el usuario.
        const userData = { email }; // Simulación de datos de usuario
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const register = (email, password) => {
        // Aquí deberías añadir la lógica para registrar un nuevo usuario.
        // Por ejemplo, podrías llamar a una API para crear una cuenta y luego iniciar sesión automáticamente.
        const userData = { email }; // Simulación de datos de usuario registrado
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
