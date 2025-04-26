import React, { useEffect, useState } from "react";
import { fetchlistasReproduccionByUserId } from "../../../services/api";
import { CircularProgress } from "@mui/material";

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

    if (loading) return <CircularProgress />;
    if (error) return <p>Error al cargar las listas de reproducción: {error}</p>;

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