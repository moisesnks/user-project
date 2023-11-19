// src/components/LoginForm/LoginForm.jsx
import React from 'react';

const LoginForm = ({ onLogin, onChange, email, password }) => {
    return (
        <form onSubmit={(e) => onLogin(e, email, password)}>
            <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email Address"
            />
            <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
            />
            <a href="#" className="link">Forgot password?</a>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
