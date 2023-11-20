// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Función de inicio de sesión que llama a 'signInWithEmailAndPassword' de Firebase Auth
    // Después de un inicio de sesión exitoso
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken(); // Obtén el token JWT

            // Llamar a la función del backend después del inicio de sesión exitoso
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envía el token JWT en lugar de userCredential
                },
                body: JSON.stringify({ token }) // Envia el token JWT como objeto
            });

            if (response.ok) {
                // Procesar la respuesta del backend
                const data = await response.json();
                console.log('Respuesta del backend después del inicio de sesión:', data);
            } else {
                console.error('Error en la solicitud al backend después del inicio de sesión');
            }
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
