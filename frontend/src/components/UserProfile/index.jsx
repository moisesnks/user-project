import React from 'react';
import UserProfileDisplay from './UserProfileDisplay';
import './UserProfile.css';

const UserProfile = ({ user, onUserUpdate, onUploadImg, onLogout }) => {
    if (!user) {
        return <div className="alert alert-warning" role="alert">Debes iniciar sesión para ver esta página.</div>;
    }

    return (
        <div className="container mt-5 user-profile-container">
            <UserProfileDisplay data={user} onUserUpdate={onUserUpdate} onUploadImg={onUploadImg} />
            <button onClick={onLogout} className="btn btn-danger mt-3 logout-button">Cerrar Sesión</button>
        </div>
    );
};

export default UserProfile;
