// src/api/perfil.js

// Esta función realizará la solicitud al endpoint /user/info con el token de autorización
// y luego redirigirá a la vista de perfil con la información del usuario.
export const ObtenerInfoPerfil = async (token) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };

    try {
        // Realiza la solicitud al servidor
        const response = await fetch('http://localhost:8080/user/info', requestOptions);

        if (response.ok) {
            // La solicitud fue exitosa, obtén la información del usuario como JSON
            const userData = await response.json();
            return userData; // Devuelve los datos del usuario
        } else {
            console.error('Error al obtener la información del usuario');
        }
    } catch (error) {
        console.error('Error en la solicitud al servidor:', error.message);
    }
};

// Esta función realizará la solicitud al endpoint /user/update con el token de autorización
// y los datos del usuario a actualizar.

export const ActualizarPerfilUsuario = async (token, datosActualizados, navigate) => {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
    };

    try {
        const response = await fetch('http://localhost:8080/user/update', requestOptions);

        if (response.ok) {
            // Después de la actualización exitosa, obtener la información del perfil actualizada
            const updatedUserData = await ObtenerInfoPerfil(token, navigate);
            return updatedUserData; // Devuelve los datos actualizados
        } else {
            // Manejar casos de error
            console.error('Error al actualizar la información del usuario');
            return null; // Devuelve null o maneja el error como prefieras
        }
    } catch (error) {
        console.error('Error en la solicitud al servidor:', error.message);
        return null; // Devuelve null o maneja el error como prefieras
    }
};

// Esta función recibe como parámetro el token, ImageFile y filename,
// que son los datos de la imagen que se va a subir al servidor.
// Luego realiza la solicitud al endpoint /user/upload-image con el token de autorización

export const UploadImageProfile = async (token, imageFile, filename, navigate) => {
    const uploadUrl = 'http://localhost:8080/user/upload-image';

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('filename', filename);

    try {
        // Subir la imagen
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!uploadResponse.ok) {
            const errorResponse = await uploadResponse.json();
            const errorMessage = errorResponse.error || 'Error al subir la imagen';
            throw new Error(errorMessage);
        }

        const uploadResult = await uploadResponse.json();

        // Actualizar el perfil del usuario con la URL de la imagen nueva
        const updateData = { ImgProfile: uploadResult.url };
        const updatedProfile = await ActualizarPerfilUsuario(token, updateData, navigate);

        return updatedProfile; // Devuelve los datos actualizados del perfil del usuario
    } catch (error) {
        console.error('Error en UploadImageProfile:', error);
        throw error;
    }
};



