import React, { useState } from "react";
import { Box, IconButton, Tooltip, Typography, Drawer, Stack, Button } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Search from "./Serch";
import GeneroSelect from "./GenerosSelect";
import OrdenSelect from "./OrdenSelect";
import DireccionSelect from "./DireccionSelect";

const Toolbar = ({
  page = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  sx = {},
  // Props para mostrar/ocultar filtros
  showSearch = true,
  showGenero = true,
  showOrden = true,
  showDireccion = true,
  // Valores y handlers de filtros
  searchValue,
  onSearchChange,
  generoValue,
  onGeneroChange,
  ordenValue,
  onOrdenChange,
  direccionValue,
  onDireccionChange,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtros = (
    <Stack direction="column" spacing={2} sx={{ p: 2 }}>
      {showSearch && (
        <Search value={searchValue} onChange={onSearchChange} placeholder="Buscar..." />
      )}
      {showGenero && (
        <GeneroSelect value={generoValue} onChange={onGeneroChange} />
      )}
      {showOrden && (
        <OrdenSelect value={ordenValue} onChange={onOrdenChange} />
      )}
      {showDireccion && (
        <DireccionSelect value={direccionValue} onChange={onDireccionChange} />
      )}
    </Stack>
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        ...sx,
      }}
    >
      {/* Botón de filtros */}
      <Tooltip title="Filtros">
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <FilterAltIcon />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { borderRadius: "16px 16px 0 0", zIndex: 20000 } }}
      >
        {filtros}
        <Box sx={{ p: 2, textAlign: "right" }}>
          <Button
            onClick={() => setDrawerOpen(false)}
            sx={{
              color: "white",
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#115293",
              },
            }}
          >
            Aplicar
          </Button>
        </Box>
      </Drawer>

      {/* Paginación */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={onPrevPage}
          disabled={page <= 1}
          size="small"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: 80, textAlign: "center" }}>
          Página {page} de {totalPages}
        </Typography>
        <IconButton
          onClick={onNextPage}
          disabled={page >= totalPages}
          size="small"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Toolbar;