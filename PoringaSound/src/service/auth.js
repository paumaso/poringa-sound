const API_URL = 'https://127.0.0.1:8000/api'; 

export const registerUser = async (nombre, email, password, tipo, imagenPerfil) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,             
          email,              
          password,          
          tipo: tipo || '',              
          imagen_perfil: imagenPerfil || '', 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data; 
      } else {
        throw new Error(data.message || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  };

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token); 
      return data.token;
    } else {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token'); 
};

export const getToken = () => {
  return localStorage.getItem('token');
};
