import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SongDrawer from "../components/SongDrawer/SongDrawer";
import { usePage } from "../context/PageContext";
import { renderContent } from "./PoringaSoundUtils.jsx";

const PoringaSound = () => {
    const { activePage } = usePage();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);

    const handleSongClick = (song) => {
        setCurrentSong(song);
        setDrawerOpen(true);
    };

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <div
                className="content"
                style={{
                    marginRight: drawerOpen ? "400px" : "0",
                    transition: "margin-right 0.3s ease",
                }}
            >
                {renderContent(activePage, handleSongClick)}
            </div>

            {/* SongDrawer */}
            <SongDrawer
                open={drawerOpen}
                onDrawerToggle={setDrawerOpen}
                songData={currentSong}
            />
        </div>
    );
};

export default PoringaSound;