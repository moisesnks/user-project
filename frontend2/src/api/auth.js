//src/api/backend.js
// Función para enviar la solicitud de inicio de sesión al backend
export const loginOnBackend = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token }) // Envia el token JWT como objeto
        });

        if (response.ok) {
            const data = await response.json();
        } else {
            console.error('Error en la solicitud al backend después del inicio de sesión');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud de inicio de sesión en el backend:', error.message);
    }
};
// Función para enviar la solicitud de registro al backend
export const registerOnBackend = async (email, uid) => {
    try {
        const userData = {
            email: email,
            uid: uid,
        };

        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // Envía los datos del usuario al backend
        });

        if (response.ok) {
            const responseData = await response.json();
        } else {
            const errorData = await response.json();
            console.error('Error en el registro en el backend:', errorData.error);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud de registro en el backend:', error.message);
    }
};