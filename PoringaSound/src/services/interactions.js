import { getToken } from "./auth.js";
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const likeSong = async (cancionId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/interacciones/like`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ cancion_id: cancionId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al dar like');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al dar like:", error);
        throw error;
    }
};

export const quitarLike = async (cancionId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/interacciones/like`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ cancion_id: cancionId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al quitar like');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al quitar like:", error);
        throw error;
    }
};

export const puntuarCancion = async (cancionId, puntuacion) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/interacciones/puntuacion`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ cancion_id: cancionId, puntuacion })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al puntuar');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al puntuar:", error);
        throw error;
    }
};