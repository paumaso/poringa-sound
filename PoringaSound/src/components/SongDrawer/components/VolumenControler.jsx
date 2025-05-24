import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

const VolumeControl = ({ audioRef, onSkipForward, onSkipBackward }) => {
  const [volume, setVolume] = useState(0.5);
  const [hovered, setHovered] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: "relative",
        userSelect: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Tooltip title={volume === 0 ? "Activar sonido" : "Silenciar"} arrow>
        <IconButton
          size="medium"
          onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
          sx={{
            bgcolor: "#f0f0f0",
            "&:hover": { bgcolor: "#d0d0d0" },
            transition: "background-color 0.3s",
          }}
        >
          {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Tooltip>

      <Box
        ref={sliderRef}
        sx={{
          width: 100,
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
          transition: "opacity 0.3s ease",
          ml: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleVolumeChange}
          aria-label="Control de volumen"
          sx={{
            color: "#1976d2",
            height: 6,
            "& .MuiSlider-thumb": {
              width: 16,
              height: 16,
              "&:focus, &:hover, &.Mui-active": {
                boxShadow: "0 0 0 8px rgba(25, 118, 210, 0.16)",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default VolumeControl;
