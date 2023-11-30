import React, { useState } from 'react';
import { FaUserCircle, FaPencilAlt } from 'react-icons/fa';
import './UserProfileDisplay.css';
import { userDataMock } from '../../mocks/userData';
import ImageChangeModal from './ImageChangeModal';

const UserProfileDisplay = ({ data, onUserUpdate, onUploadImg }) => {
    const [imageError, setImageError] = useState(false);
    const { user: mockUser, isEditable } = userDataMock;

    const [editingField, setEditingField] = useState(null);
    const [editedValue, setEditedValue] = useState('');
    const [previousValues, setPreviousValues] = useState({});
    const [changes, setChanges] = useState({});
    const [showModal, setShowModal] = useState(false);



    const user = data || mockUser;

    const handleEditClick = (field) => {
        if (isEditable[field]) {
            setEditingField(field);
            setEditedValue(user[field]);
            setPreviousValues((prev) => ({ ...prev, [field]: user[field] }));
        }
    };

    const handleSaveClick = (field) => {
        if (editingField) {
            user[field] = editedValue; // Actualiza el campo en el objeto de usuario
            setEditingField(null); // Termina la edición
            setChanges((prevChanges) => ({ ...prevChanges, [field]: editedValue })); // Guarda los cambios
        }
    };

    const handleUploadClick = (imageFile, filename) => {
        if (onUploadImg) onUploadImg(imageFile, filename);
    };

    const handleImageError = () => {
        setImageError(true); // Maneja el error de carga de imagen
    };

    const handleBtnClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveChangesClick = () => {
        console.log('Cambios realizados:', changes); // Muestra los cambios en la consola
        onUserUpdate(changes); // Envía los cambios al componente padre
    };

    // Verifica si hay cambios realizados para habilitar el botón de guardar
    const hasChanges = Object.keys(changes).length > 0;



    return (
        <div className="user-profile-display">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-image">
                            {user.ImgProfile && !imageError ? (
                                <img
                                    src={user.ImgProfile}
                                    alt="Imagen de Perfil"
                                    className="img-fluid rounded-circle custom-img"
                                    onError={handleImageError}
                                />
                            ) : (
                                <FaUserCircle size={100} className="custom-icon" />
                            )}
                            <div className="column my-4">
                                <button
                                    type="button"
                                    onClick={handleBtnClick}
                                    className="btn btn-secondary">
                                    Cambiar Imagen
                                </button>
                                <ImageChangeModal
                                    show={showModal}
                                    handleClose={handleCloseModal}
                                    imgUrl={data.ImgProfile}
                                    userUid={data.ID}
                                    onUpload={handleUploadClick}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="profile-details">
                            <h2 className="custom-title">Información del Usuario</h2>
                            <ul className="list-group custom-list">
                                {Object.keys(user)
                                    .filter((field) => field !== "ImgProfile") // Excluye el campo de imagen del perfil
                                    .map((field) => (
                                        <li className="list-group-item custom-item" key={field}>
                                            <strong>{field}:</strong>
                                            {editingField === field ? (
                                                // Muestra un input para editar si el campo está en edición
                                                <>
                                                    <del>{previousValues[field]}</del>
                                                    <input
                                                        type="text"
                                                        value={editedValue}
                                                        onChange={(e) => setEditedValue(e.target.value)}
                                                    />
                                                </>
                                            ) : (
                                                // Muestra el valor del campo, con opción a editar
                                                <>
                                                    {previousValues[field] && (
                                                        <>
                                                            <del>{previousValues[field]}</del> (Anterior)
                                                            <br />
                                                        </>
                                                    )}
                                                    {user[field]}
                                                    {isEditable[field] && (
                                                        <FaPencilAlt
                                                            className="edit-icon"
                                                            onClick={() => handleEditClick(field)}
                                                        />
                                                    )}
                                                </>
                                            )}
                                            {editingField === field && (
                                                <button onClick={() => handleSaveClick(field)}>Guardar</button>
                                            )}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                {hasChanges && (
                    <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={handleSaveChangesClick}>
                        Guardar cambios
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserProfileDisplay;
