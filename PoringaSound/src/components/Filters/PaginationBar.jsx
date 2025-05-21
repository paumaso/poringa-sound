import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const PaginationBar = ({ page, totalPages, onPageChange, sx = {} }) => (
    <Box
        sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 1,
            zIndex: 999,
            ...sx,
        }}
    >
        <IconButton
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            size="large"
        >
            <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ mx: 2 }}>
            Página {page} de {totalPages}
        </Typography>
        <IconButton
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            size="large"
        >
            <ChevronRightIcon />
        </IconButton>
    </Box>
);

export default PaginationBar;