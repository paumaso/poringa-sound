const API_URL = 'https://127.0.0.1:8000/api';

export const fetchRandomSongs = async (query = '') => {
    try {
      const response = await fetch(`${API_URL}/canciones`);
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Error al obtener canciones:", error);
      throw error;
    }
  };