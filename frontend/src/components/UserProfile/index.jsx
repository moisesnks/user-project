import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate además de useLocation
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta de importación sea correcta

const UserProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth(); // Obtiene la función logout del contexto

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Redirecciona a la página de inicio después del logout
    };

    if (location.state && location.state.userData) {
        const user = location.state.userData;

        return (
            <div>
                <h1>{user.name}</h1>
                <p>{user.email}</p>
                {/* Otros detalles del perfil */}
                <button onClick={handleLogout}>Cerrar Sesión</button> {/* Botón de logout */}
            </div>
        );
    } else {
        // Si no hay datos de usuario, puedes redirigir al usuario o mostrar un mensaje
        // Por ejemplo, redirigir al inicio o a la página de login
        return <p>No se encontraron datos de usuario.</p>;
    }
};

export default UserProfile;
