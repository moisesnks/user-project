import React from 'react';
import { useLocation } from 'react-router-dom'; // Importa useLocation desde 'react-router-dom'

const UserProfile = () => {
    // Obtén la ubicación actual
    const location = useLocation();

    // Verifica si hay datos de usuario en la ubicación
    if (location.state && location.state.userData) {
        // Obtiene los datos del usuario desde la ubicación
        const user = location.state.userData;

        return (
            <div>
                <h1>{user.name}</h1>
                <p>{user.email}</p>
                {/* Otros detalles del perfil */}
            </div>
        );
    } else {
        // Si no hay datos de usuario, muestra un mensaje de error o redirige a otra página
        return <p>No se encontraron datos de usuario.</p>;
    }
};

export default UserProfile;
