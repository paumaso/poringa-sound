import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

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
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      Cookies.set("token", data.token, { expires: 1 });
      return { token: data.token, user: data.user };
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
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      Cookies.set("token", data.token, { expires: 1 });
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return { token: data.token, user: data.user };
    } else {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const logoutUser = () => {
  try {
    const token = Cookies.get("token");
    if (token) {
      fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      });
      Cookies.remove("token");
    }
  }
  catch (error) {
    console.error("Error al cerrar sesión:", error);
  }

};

export const getToken = () => {
  return Cookies.get("token");
};

export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
