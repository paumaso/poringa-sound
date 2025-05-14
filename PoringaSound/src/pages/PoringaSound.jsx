import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SongDrawer from "../components/SongDrawer/SongDrawer";
import { usePage } from "../context/PageContext";
import { renderContent } from "./PoringaSoundUtils.jsx";

const PoringaSound = () => {
    const { activePage, setActivePage } = usePage(); 
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);

    const handleSongClick = (song) => {
        setCurrentSong(song);
        setDrawerOpen(true);
    };

    const handleSongDetailsClick = (song) => {
        setSelectedSong(song);
        setActivePage("song");
    };

    return (
        <div>
            <Navbar />

            <div
                style={{
                    marginRight: drawerOpen ? "400px" : "0",
                    transition: "margin-right 0.4s ease",
                }}
            >
                {renderContent(activePage, selectedSong, handleSongClick, handleSongDetailsClick)}
            </div>

            <SongDrawer
                open={drawerOpen}
                onDrawerToggle={setDrawerOpen}
                songId={currentSong?.id}
            />
        </div>
    );
};

export default PoringaSound;