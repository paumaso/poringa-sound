import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  return Cookies.get("token");
};

const handleResponseError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401) {
      throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
    }
    throw new Error(`Error: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
  }
  return response.json();
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

    const data = await handleResponseError(response);
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

    const data = await handleResponseError(response);
    return data;
  } catch (error) {
    console.error("Error al obtener álbumes por usuario:", error);
    throw error;
  }
};

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

    const data = await handleResponseError(response);
    return data;
  } catch (error) {
    console.error("Error al obtener listas de reproducción por usuario:", error);
    throw error;
  }
};

export const fetchGeneros = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/generos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleResponseError(response);
    return data;
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    throw error;
  }
};

export const fetchCreateSong = async (formData) => {
  try {
    const token = getAuthToken();
    console.log(formData)
    const response = await fetch(`${API_URL}/canciones/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await handleResponseError(response);
    return data;
  } catch (error) {
    console.error("Error al crear la canción:", error);
    throw error;
  }
};
