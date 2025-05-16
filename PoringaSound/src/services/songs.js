import { getToken } from "./auth.js";
const API_URL = import.meta.env.VITE_API_URL;

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

export const fetchAllSongs = async (page = 1, perPage = 10) => {
    try {
        const token = getToken();
        const response = await fetch(
            `${API_URL}/public/canciones/random-list?page=${page}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener todas las canciones:", error);
        throw error;
    }
};

export const fetchSongsPreferences = async (page = 1, perPage = 10) => {
    try {
        const token = getToken();
        const response = await fetch(
            `${API_URL}/canciones/preferencia?page=${page}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener canciones:", error);
        throw error;
    }
}

export const fetchSongById = async (id) => {
    try {
        const token = getToken();
        var response;
        if (!token) {
            response = await fetch(`${API_URL}/public/canciones/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
        } else {
            response = await fetch(`${API_URL}/canciones/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
        }

        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener la canción:", error);
        throw error;
    }
};

export const fetchRandomSong = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/public/canciones/random`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener canción aleatoria:", error);
        throw error;
    }
};

export const fetchSongByUserId = async (userId, page = 1, perPage = 10) => {
    try {
        const token = getToken();
        const response = await fetch(
            `${API_URL}/canciones/user/${userId}?page=${page}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await handleResponseError(response);
        return data;
    } catch (error) {
        console.error("Error al obtener canciones por usuario:", error);
        throw error;
    }
};

export const fetchCreateSong = async (formData) => {
    try {
        const token = getToken();
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

export const fetchUpdateSong = async (id, formData) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/canciones/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al actualizar canción:", error);
        throw error;
    }
};

export const fetchDeleteSong = async (songId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/canciones/${songId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const data = await handleResponseError(response);
        return data;
    } catch (error) {
        console.error("Error al eliminar la canción:", error);
        throw error;
    }
};

export const fetchGeneros = async () => {
  try {
    const token = getToken();
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
