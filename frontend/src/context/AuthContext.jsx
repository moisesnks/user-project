import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Función de inicio de sesión que llama a 'signInWithEmailAndPassword' de Firebase Auth
    const login = async (email, password) => {
        console.log('Iniciando sesión...', email, password)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const newToken = await userCredential.user.getIdToken(); // Obtén el token JWT
            setToken(newToken);
            setUser(userCredential.user); // Actualiza el estado del usuario
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    };

    // UseEffect para manejar acciones después de actualizar el token
    useEffect(() => {
        if (token) {
            loginOnBackend(token);
        }
    }, [token]); // Se ejecuta cuando el token cambia

    // Función para enviar la solicitud de inicio de sesión al backend
    const loginOnBackend = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}` // No se utiliza el prefijo "Bearer" aquí
                }
            });

            if (response.ok) {
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
            await signOut(auth);
            setToken(null); // Limpia el token
            setUser(null); // Limpia el usuario
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    // Función de registro
    const register = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            setUser(userCredential.user); // Actualiza el estado del usuario
            await registerOnBackend(email, uid); // Llama a registerOnBackend con el email y uid
            await login(email, password); // Inicia sesión después de registrar
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
                const responseData = await response.json();
                console.log('Registro en el backend exitoso:', responseData.message);
            } else {
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
