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

export const fetchAllAlbums = async (page = 1, perPage = 10, titulo = "") => {
    try {
        const token = getToken();
        const params = new URLSearchParams({ page, per_page: perPage });
        if (titulo) params.append("titulo", titulo);

        const response = await fetch(`${API_URL}/albums?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener álbumes:", error);
        throw error;
    }
};

export const fetchAlbumsByUserId = async (userId, page = 1, perPage = 10, titulo = "") => {
    try {
        const token = getToken();
        const params = new URLSearchParams({ per_page: perPage });
        if (titulo) params.append("titulo", titulo);

        const response = await fetch(`${API_URL}/albums/user/${userId}?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener álbumes por usuario:", error);
        throw error;
    }
};

export const fetchAlbumById = async (id) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/albums/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener álbum por ID:", error);
        throw error;
    }
};

export const fetchAlbumSongs = async (id) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/albums/songs/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al obtener canciones del álbum:", error);
        throw error;
    }
};

export const fetchCreateAlbum = async (formData) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/albums`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al crear álbum:", error);
        throw error;
    }
};

export const fetchUpdateAlbum = async (id, formData) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/albums/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al actualizar álbum:", error);
        throw error;
    }
};

export const fetchUpdateAlbumCanciones = async (id, canciones) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/albums/canciones/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ canciones }),
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al actualizar canciones del álbum:", error);
        throw error;
    }
};

export const fetchDeleteAlbum = async (id) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/albums/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return await handleResponseError(response);
    } catch (error) {
        console.error("Error al eliminar álbum:", error);
        throw error;
    }
};
