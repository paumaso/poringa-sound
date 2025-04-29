import React, { useEffect, useState } from "react";
import { fetchlistasReproduccionByUserId } from "../../../../services/api";
import { 
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";

const UserLists = ({ userId }) => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const data = await fetchlistasReproduccionByUserId(userId);
                setLists(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
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
            {lists.length === 0 ? (
                <p>No hay listas de reproducción disponibles.</p>
            ) : (
                <ul>
                    {lists.map((list) => (
                        <li key={list.id}>{list.nombre}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserLists;