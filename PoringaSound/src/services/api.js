import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  return Cookies.get("token");
};

export const fetchSongByUserId = async (userId, page = 1, perPage = 10) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/canciones/user/${userId}?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
      }
      throw new Error(`Error al obtener canciones: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener canciones por usuario:", error);
    throw error;
  }
};

export const fetchAlbumsByUserId = async (userId, page = 1, perPage = 10) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/albums/user/${userId}?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
      }
      throw new Error(`Error al obtener álbumes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener álbumes por usuario:", error);
    throw error;
  }
}

export const fetchlistasReproduccionByUserId = async (userId, page = 1, perPage = 10) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${API_URL}/listasReproduccion/user/${userId}?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
      }
      throw new Error(`Error al obtener listas de reproducción: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener listas de reproducción por usuario:", error);
    throw error;
  }
}