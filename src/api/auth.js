import axios from 'axios';

const API_URL = '/api/auth'; // Asegúrate de configurar la base URL correctamente

export const login = async (credentials) => {
    const { data } = await axios.post(`${API_URL}/login`, credentials);
    return data;
};

// Agrega más funciones según sea necesario para registro, logout, etc.
