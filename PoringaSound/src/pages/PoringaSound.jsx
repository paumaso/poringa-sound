import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { usePage } from "../context/PageContext";
import Navbar from "../components/Navbar/Navbar";
import SongDrawer from "../components/SongDrawer/SongDrawer";
import Home from "../components/Home/Home";
import Discover from "../components/Discover/Discover";
import Account from "../components/Account/Account";
import AllSongs from "../components/AllSongs/AllSongs";
import SongDetails from "../components/Details/SongDetails/SongDetails";
import AlbumDetails from "../components/Details/AlbumDetails/AlbumDetails";
import ArtistDetails from "../components/Details/ArtistDetalls/ArtistDetails";

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
        navigate(`/song/${song.id}`);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <Navbar />

            <div
                style={{
                    flexGrow: 1,
                    overflowY: "auto",
                    marginRight: drawerOpen ? "400px" : "0",
                    transition: "margin-right 0.4s ease",
                }}
            >
                <Routes>
                    <Route path="/" element={<Home onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} />} />
                    <Route path="/discover" element={<Discover onDetailsClick={handleSongDetailsClick} />} />
                    <Route path="/account" element={<Account onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} />} />
                    <Route path="/song/:id" element={<SongDetails onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} />} />
                    <Route path="/album/:id" element={<AlbumDetails onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} />} />
                    <Route path="/artist/:id" element={<ArtistDetails onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} />} />
                    <Route path="/songs" element={<AllSongs onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick}/>}/>
                </Routes>
            </div>

            {window.location.pathname !== "/discover" && (
                <SongDrawer
                    open={drawerOpen}
                    onDrawerToggle={setDrawerOpen}
                    songId={currentSong?.id}
                />
            )}
        </div>
    );
};

export default PoringaSound;