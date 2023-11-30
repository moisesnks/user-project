import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../../components/UserProfile';
import { ObtenerInfoPerfil, ActualizarPerfilUsuario, UploadImageProfile } from '../../api/perfil';
import Spinner from 'react-bootstrap/Spinner'; // Asegúrate de tener este componente

const UserProfilePage = () => {
    const { token, user, setUser, logout } = useAuth();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

    useEffect(() => {
        if (token) {
            console.log('Obteniendo datos de perfil')
            ObtenerInfoPerfil(token).then(userData => {
                setData(userData);
                setIsLoading(false); // Detener la carga una vez se obtengan los datos
            });
        } else {
            setIsLoading(false); // Detener la carga si no hay token
        }
    }, [token]);

    const handleUserUpdate = async (updatedData) => {
        const updatedUserData = await ActualizarPerfilUsuario(token, updatedData);
        setData(updatedUserData);
        window.location.reload();
    };

    const handleUploadImage = async (imageFile, filename) => {
        const updatedUserData = await UploadImageProfile(token, imageFile, filename);
        setData(updatedUserData);
        window.location.reload();
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            <UserProfile
                user={data}
                onUserUpdate={handleUserUpdate}
                onUploadImg={handleUploadImage}
                onLogout={handleLogout}
            />
        </div>
    );
};

export default UserProfilePage;
