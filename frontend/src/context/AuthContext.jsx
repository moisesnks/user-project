// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Función de inicio de sesión que llama a 'signInWithEmailAndPassword' de Firebase Auth
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = userCredential.user;
            setUser(userData);
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    };

    // Función de cierre de sesión
    const logout = async () => {
        try {
            await signOut(auth); // Utiliza la función signOut para cerrar la sesión
            setUser(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    // Función de registro
    const register = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Utiliza la función createUserWithEmailAndPassword para registrar nuevos usuarios
            const userData = userCredential.user;
            setUser(userData);
        } catch (error) {
            console.error('Error al registrar usuario:', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
