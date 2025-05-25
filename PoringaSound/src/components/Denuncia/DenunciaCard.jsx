import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  CardMedia,
  Stack,
  IconButton,
} from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import DenunciaActions from "./DenunciaActions";

const DenunciaCard = ({ denuncia, onAction }) => {
  const { motivo, estado, usuario, cancion } = denuncia;
  const apiUrl = import.meta.env.VITE_STORAGE_URL;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false)
    } else {
      audioRef.current.play();
      setIsPlaying(true)
    }
  };

  React.useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="stretch"
        justifyContent="space-between"
      >
        {/* Datos de la denuncia */}
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Motivo:
            </Typography>
            <Typography>{motivo}</Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Estado: <strong>{estado}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Usuario: {usuario?.nombre || "Anónimo"}
            </Typography>

            {estado === "pendiente" && (
              <Box sx={{ mt: 2 }}>
                <DenunciaActions id={denuncia.id} onAction={onAction} />
              </Box>
            )}
          </CardContent>
        </Box>

        {/* Tarjeta de la canción */}
        {cancion && (
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Divider sx={{ mb: 1, display: { xs: "block", sm: "none" } }} />
            <Card
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                bgcolor: "#fafbfc",
                boxShadow: 0,
              }}
            >
              {/* Portada a la izquierda */}
              <CardMedia
                component="img"
                width="80"
                height="80"
                alt={`Portada de ${cancion?.titulo}`}
                src={apiUrl + cancion.portada}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  objectFit: "cover",
                  boxShadow: 2,
                }}
              />

              {/* Título + Botón de reproducción */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  color="text.primary"
                  fontWeight="semiBold"
                  noWrap
                  sx={{ mb: 1 }}
                >
                  {cancion?.titulo || "Sin título"}
                </Typography>

                {cancion.archivo && (
                  <>
                    <audio
                      ref={audioRef}
                      src={apiUrl + cancion.archivo}
                      style={{ display: "none" }}
                    />
                    <IconButton
                      aria-label={isPlaying ? "Pausar" : "Reproducir"}
                      onClick={handlePlayPause}
                      color="primary"
                      size="large"
                    >
                      {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
                    </IconButton>
                  </>
                )}
              </Box>
            </Card>
          </Box>
        )}
      </Stack>
    </Card>
  );
};

export default DenunciaCard;
