import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './ImageChangeModal.css';

const ImageChangeModal = ({ show, handleClose, imgUrl, userUid, onUpload }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setSelectedImage(URL.createObjectURL(img)); // Crea una URL temporal para la imagen seleccionada
            setImageFile(img); // Almacena el archivo de imagen
        }
    };

    const handleUploadClick = () => {
        if (imageFile) {
            const extension = imageFile.name.split('.').pop();
            const filename = `${userUid}.${extension}`;
            // console.log('Archivo a subir:', imageFile, 'Nombre de archivo:', filename);
            if (onUpload) onUpload(imageFile, filename);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cambiar Imagen de Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex gap-4">
                    <div className="mb-3">
                        <h5>Imagen Actual:</h5>
                        {imgUrl ? (
                            <img src={imgUrl} alt="Imagen de Perfil" onError={() => alert('La imagen no se encuentra disponible')} className="image-preview" />
                        ) : (
                            <p>No hay imagen de perfil actualmente.</p>
                        )}
                    </div>

                    <div className="d-flex flex-column">
                        <h5>Imagen a Subir:</h5>
                        {selectedImage && <img src={selectedImage} alt="Previsualización" className="image-preview" />}
                        <input type="file" onChange={handleImageChange} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleUploadClick}>
                    Subir Imagen
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageChangeModal;
