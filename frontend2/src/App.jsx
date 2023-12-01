import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const App = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    // Obtener el token de las cookies
    const cookieToken = Cookies.get('token');
    // Actualizar el estado con el token
    setToken(cookieToken || 'No hay token');
  }, []);

  return (
    <div>
      <h1>Token de Autenticación</h1>
      <p>{token}</p>
    </div>
  );
};

export default App;
