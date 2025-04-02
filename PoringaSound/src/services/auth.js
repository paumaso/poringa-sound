const API_URL = 'http://127.0.0.1:8000/api';

export const registerUser = async (nombre, email, password, imagenPerfil) => {
  try {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("password", password);

    if (imagenPerfil) {
      formData.append("imagen_perfil", imagenPerfil);
    }

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      return data.token;
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
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      return data;
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
