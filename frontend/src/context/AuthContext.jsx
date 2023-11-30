import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { loginOnBackend, registerOnBackend } from '../api';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const newToken = await currentUser.getIdToken();
                localStorage.setItem('token', newToken); // Guardar en almacenamiento local
                setToken(newToken);
                setUser(currentUser);
            } else {
                localStorage.removeItem('token'); // Eliminar del almacenamiento local
                setToken(null);
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const newToken = await userCredential.user.getIdToken();
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userCredential.user);
            await loginOnBackend(newToken); // Llamar a loginOnBackend con el nuevo token
            console.log('Loggin exitoso');
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    const register = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            await registerOnBackend(email, userCredential.user.uid);
            await login(email, password); // Inicia sesión automáticamente después de registrar
            console.log('Registro exitoso');
        } catch (error) {
            console.error('Error al registrar usuario:', error.message);
        }
    };



    const getToken = () => token;

    return (
        <AuthContext.Provider value={{ token, user, login, logout, register, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
