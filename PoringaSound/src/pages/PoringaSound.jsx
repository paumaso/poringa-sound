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
        console.log("Drawer open state:", drawerOpen);
        setCurrentSong(song);
        setDrawerOpen(true);
        console.log("Drawer open state:", drawerOpen);
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
                songData={currentSong?.id}
            />
        </div>
    );
};

export default PoringaSound;