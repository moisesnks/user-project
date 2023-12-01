import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { loginOnBackend, registerOnBackend } from '../api';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get('token') || null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const newToken = await currentUser.getIdToken();
                Cookies.set('tokenS', newToken, { domain: '.local' });
                setToken(newToken);
                setUser(currentUser);
            } else {
                Cookies.remove('token', { domain: '.local' });
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
            Cookies.set('token', newToken, { domain: '.local' });
            setToken(newToken);
            setUser(userCredential.user);
            await loginOnBackend(newToken);
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            Cookies.remove('token', { domain: '.local' });
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
            await login(email, password);
        } catch (error) {
            console.error('Error al registrar usuario:', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, register, getToken: () => Cookies.get('token') }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
