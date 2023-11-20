// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

import ObtenerInfoPerfil from '../api/perfil';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [uid, setUid] = useState(null);


    // Función de inicio de sesión que llama a 'signInWithEmailAndPassword' de Firebase Auth
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken(); // Obtén el token JWT
            setToken(token);

            // Llamar a la función del backend después del inicio de sesión exitoso
            await loginOnBackend(token);

        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    };

    // Función para enviar la solicitud de inicio de sesión al backend
    const loginOnBackend = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
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
            console.error('Error al realizar la solicitud de inicio de sesión en el backend:', error.message);
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userData = userCredential.user;
            setUser(userData);

            // Obtener el UID del usuario registrado
            const uid = userData.uid;
            setUid(uid);

            // Llamar a la función del backend después del registro exitoso
            await registerOnBackend(email, uid);

            // Después del registro, inicia sesión automáticamente
            await login(email, password);
        } catch (error) {
            console.error('Error al registrar usuario:', error.message);
        }
    };

    // Función para enviar la solicitud de registro al backend
    const registerOnBackend = async (email, uid) => {
        try {
            const userData = {
                email: email,
                uid: uid,
            };

            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), // Envía los datos del usuario al backend
            });

            if (response.ok) {
                // El usuario se ha registrado correctamente en el backend
                const responseData = await response.json();
                console.log('Registro en el backend exitoso:', responseData.message);
                // Puedes realizar otras acciones aquí si es necesario
            } else {
                // Error en el registro en el backend
                const errorData = await response.json();
                console.error('Error en el registro en el backend:', errorData.error);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud de registro en el backend:', error.message);
        }
    };

    // Función para obtener el token actual
    const getToken = () => token;

    return (
        <AuthContext.Provider value={{ user, login, logout, register, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
