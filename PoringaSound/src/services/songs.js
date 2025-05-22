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

export const fetchAllSongs = async ({ page = 1, perPage = 10, query = "", genero_id = "", artista = "", orden = "nombre", direccion = "asc" } = {}) => {
    try {
        const token = getToken();
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("per_page", perPage);
        if (query) params.append("query", query);
        if (genero_id) params.append("genero_id", genero_id);
        if (artista) params.append("artista", artista);
        if (orden) params.append("orden", orden);
        if (direccion) params.append("direccion", direccion);

        const response = await fetch(
            `${API_URL}/public/canciones/all?${params.toString()}`,
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

export const fetchDiscoverSongs = async (page = 1, perPage = 10) => {
    try {
        const token = getToken();
        const response = await fetch(
            `${API_URL}/canciones/discover?page=${page}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener canciones de discover:", error);
        throw error;
    }
};

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

export const fetchSongByUserId = async (
    userId,
    page = 1,
    perPage = 10,
    { generoId = "", query = "", orden = "nombre", direccion = "asc" } = {}
) => {
    try {
        const token = getToken();
        const params = new URLSearchParams({
            page,
            per_page: perPage,
        });
        if (generoId) params.append("genero_id", generoId);
        if (query) params.append("query", query);
        if (orden) params.append("orden", orden);
        if (direccion) params.append("direccion", direccion);

        const response = await fetch(
            `${API_URL}/canciones/user/${userId}?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return await handleResponseError(response);
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

        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al crear la canción:", error);
        throw new Error(error.message || "Error al crear la canción");
    }
};

export const fetchUpdateSong = async (id, formData) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/canciones/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });

        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al actualizar canción:", error);
        throw new Error(error.message || "Error al actualizar canción");
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

        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al eliminar la canción:", error);
        throw new Error(error.message || "Error al eliminar la canción");
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
