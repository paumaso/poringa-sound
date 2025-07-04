import { getToken } from "./auth";
const API_URL = import.meta.env.VITE_API_URL;

export const createDenuncia = async ({ cancion_id, motivo }) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/denuncias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancion_id, motivo }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al crear denuncia");
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al crear denuncia");
  }
};

export const fetchDenuncias = async (page = 1, perPage = 10) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/denuncias?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al obtener denuncias");
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener denuncias");
  }
};

export const fetchDenunciasPendientes = async (page = 1, perPage = 10) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/denuncias/pendientes?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al obtener denuncias pendientes");
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener denuncias pendientes");
  }
};

export const aceptarDenuncia = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/denuncias/${id}/aceptar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al aceptar la denuncia");
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al aceptar la denuncia");
  }
};

export const rechazarDenuncia = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/denuncias/${id}/rechazar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al rechazar la denuncia");
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al rechazar la denuncia");
  }
};
