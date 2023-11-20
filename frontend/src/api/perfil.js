// src/api/perfil.js

// Esta función realizará la solicitud al endpoint /auth/user/info con el token de autorización
// y luego redirigirá a la vista de perfil con la información del usuario.
const ObtenerInfoPerfil = async (token, navigate) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        },
    };

    try {
        // Realiza la solicitud al servidor
        const response = await fetch('http://localhost:8080/auth/user/info', requestOptions);

        if (response.ok) {
            // La solicitud fue exitosa, obtén la información del usuario como JSON
            const userData = await response.json();

            // Redirige a la vista de perfil y pasa los datos del usuario como estado
            // navigate('/perfil', { state: { userData } });
        } else {
            console.error('Error al obtener la información del usuario');
        }
    } catch (error) {
        console.error('Error en la solicitud al servidor:', error.message);
    }
};

export default ObtenerInfoPerfil;
