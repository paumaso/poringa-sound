import React, { useEffect, useState } from "react";
import { fetchAlbumsByUserId } from "../../../../services/api";
import { 
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";

const UserAlbums = ({ userId }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const data = await fetchAlbumsByUserId(userId);
                setAlbums(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [userId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">Error al cargar las canciones: {error}</Typography>
            </Box>
        );
    }

    return (
        <div>
            {albums.length === 0 ? (
                <p>No hay álbumes disponibles.</p>
            ) : (
                <ul>
                    {albums.map((album) => (
                        <li key={album.id}>{album.nombre}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserAlbums;