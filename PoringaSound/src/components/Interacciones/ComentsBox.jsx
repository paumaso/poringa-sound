import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { getToken, getUser } from "../../services/auth";
import { comentarCancion } from "../../services/interactions";
import { color } from "framer-motion";

const ComentsBox = ({ coments = [], songId, onNewComent }) => {
  const apiUrl = import.meta.env.VITE_STORAGE_URL;
  const isAuthenticated = !!getToken();
  const user = getUser();

  const [comentario, setComentario] = useState("");
  const [sending, setSending] = useState(false);
  const [comentariosAnimados, setComentariosAnimados] = useState([]);

  const handleSend = async () => {
    if (!comentario.trim()) return;
    setSending(true);
    try {
      const nuevoComentario = await comentarCancion(songId, comentario);

      nuevoComentario.user = {
        nombre: user?.nombre,
        imagen_perfil: user?.imagen_perfil,
      };

      onNewComent(nuevoComentario);
      setComentario("");
      setComentariosAnimados((prev) => [nuevoComentario, ...prev]);

      setTimeout(() => {
        setComentariosAnimados((prev) =>
          prev.filter((coment) => coment.id !== nuevoComentario.id)
        );
      }, 1000);
    } catch (err) {
      console.error("Error al enviar comentario:", err);
    } finally {
      setSending(false);
    }
  };

  // Función para obtener iniciales del nombre del usuario
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Comentarios
      </Typography>

      {isAuthenticated && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              flex: 1,
              width: "100%",
            }}
          >
            <Avatar
              src={user?.imagen_perfil ? apiUrl + user.imagen_perfil : undefined}
              alt={user?.nombre}
              sx={{ bgcolor: "primary.main" }}
            >
              {!user?.imagen_perfil && getInitials(user?.nombre)}
            </Avatar>

            <TextField
              fullWidth
              placeholder="Escribe un comentario..."
              variant="outlined"
              size="small"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              disabled={sending}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey && comentario.trim()) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </Box>

          <Box
            sx={{
              mt: { xs: 1, sm: 0 },
              width: { xs: "100%", sm: "auto" },
              alignSelf: { xs: "flex-end", sm: "center" },
            }}
          >
            <Button
              onClick={handleSend}
              disabled={sending || !comentario.trim()}
              variant="contained"
              endIcon={<SendIcon />}
              fullWidth
            >
              Enviar
            </Button>
          </Box>
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        {coments.length > 0 ? (
          [...coments]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((coment) => (
              <Box
                key={coment.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  animation: comentariosAnimados.some(
                    (newComent) => newComent.id === coment.id
                  )
                    ? "fadeIn 1s ease-out"
                    : "none",
                }}
              >
                <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                  <Avatar
                    src={
                      coment.user?.imagen_perfil
                        ? apiUrl + coment.user.imagen_perfil
                        : undefined
                    }
                    alt={coment.user?.nombre}
                    sx={{ width: 40, height: 40, bgcolor: "primary.main", }}
                  >
                    {!coment.user?.imagen_perfil && getInitials(coment.user?.nombre)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {coment.user?.nombre}{" "}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ color: "text.secondary", ml: 1 }}
                      >
                        {new Date(coment.created_at).toLocaleDateString()}
                      </Typography>
                    </Typography>
                    <Typography variant="body2">{coment.comentario}</Typography>
                  </Box>
                </Box>
              </Box>
            ))
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay comentarios todavía.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ComentsBox;
