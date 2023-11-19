// src/components/UserProfile/index.jsx
import React from 'react';

const UserProfile = () => {
    // Suponiendo que tienes datos de usuario para mostrar
    const user = { name: 'Jane Doe', email: 'jane@example.com' };

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            {/* Otros detalles del perfil */}
        </div>
    );
};

export default UserProfile;
