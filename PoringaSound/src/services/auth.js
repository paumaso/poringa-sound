import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en registro');
    }

    Cookies.set('token', data.token, { expires: 1 });

    return { token: data.token, user: data.user };
  } catch (error) {
    console.error('Register error:', error.message);
    throw new Error(error.message || 'Error al registrar');
  }
};

export const editUser = async (userId, formData) => {
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario');
    }

    sessionStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw new Error(error.message || 'Error al actualizar');
  }
};

export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Credenciales incorrectas');
      }
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    Cookies.set('token', data.token, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    sessionStorage.setItem('user', JSON.stringify(data.user));
    return { token: data.token, user: data.user };
  } catch (error) {
    console.error('Login error:', error.message);
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

export const fetchUsersWithActiveSongs = async ({
  page = 1,
  perPage = 10,
  query = "",
  orden = "nombre",
  direccion = "asc",
  tipo = ""
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("per_page", perPage);
    if (query) params.append("query", query);
    if (orden) params.append("orden", orden);
    if (direccion) params.append("direccion", direccion);
    if (tipo) params.append("tipo", tipo);

    const response = await fetch(`${API_URL}/public/artistas/all?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Error al obtener los usuarios");
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

export const fetchUserById = async (id, page = 1, perPage = 10) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("per_page", perPage);

    const response = await fetch(`${API_URL}/public/artistas/${id}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Error al obtener el usuario");
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};

export const getToken = () => {
  return Cookies.get("token");
};

export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getMe = async () => {
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener el usuario');
    }

    return data;
  } catch (error) {
    console.error("Error en getMe:", error);
    throw error;
  }
};
