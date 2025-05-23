import React, { useEffect } from "react";
import { 
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";
import DenunciaActions from "./DenunciaActions";

const DenunciaCard = ({ denuncia, onAction }) => {
  const { motivo, estado, usuario, denunciable_type, denunciable_id } = denuncia;
  useEffect(() => {
    console.log("DenunciaCard props:", denuncia);
  } , [denuncia]);
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">Motivo:</Typography>
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
    </Card>
  );
};

export default DenunciaCard;
