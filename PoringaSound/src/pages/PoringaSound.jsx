import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminRoute from "../components/Routes/AdminRoutes"
import AdminDenuncias from "./AdminDenuncias";

import Navbar from "../components/Navbar/Navbar";
import SongDrawer from "../components/SongDrawer/SongDrawer";
import Home from "./Home";
import Discover from "./Discover";
import Account from "./Account";
import AllSongs from "./AllSongs";
import SongDetails from "../components/Details/SongDetails/SongDetails";
import AlbumDetails from "../components/Details/AlbumDetails/AlbumDetails";
import ArtistDetails from "../components/Details/ArtistDetalls/ArtistDetails";
import AllAlbums from "./AllAlbums";
import AllArtistas from "./AllArtistas";

const PoringaSound = () => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentAlbum, setCurrentAlbum] = useState(null);

    const hideDrawerRoutes = ["/discover", "/admin"];
    const shouldShowDrawer = !hideDrawerRoutes.includes(location.pathname);

    useEffect(() => {
        if (!shouldShowDrawer && drawerOpen) {
            setDrawerOpen(false);
        }
    }, [shouldShowDrawer, drawerOpen]);

    const handleSongClick = (song) => {
        setCurrentAlbum(null);
        setCurrentSong(song);
        setDrawerOpen(true);
    };

    const handleAlbumClick = (albumId) => {
        setCurrentSong(null);
        setCurrentAlbum(albumId);
        setDrawerOpen(true);
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
                    <Route path="/" element={<Home onSongClick={handleSongClick} onAlbumClick={handleAlbumClick} />} />
                    {isAuthenticated && (
                        <Route path="/discover" element={<Discover />} />
                    )}
                    {isAuthenticated && (
                        <Route path="/account" element={<Account onSongClick={handleSongClick} onAlbumClick={handleAlbumClick} />} />
                    )}
                    <Route path="/song/:id" element={<SongDetails onSongClick={handleSongClick} />} />
                    <Route path="/album/:id" element={<AlbumDetails onSongClick={handleSongClick} onAlbumClick={handleAlbumClick} />} />
                    <Route path="/artist/:id" element={<ArtistDetails onSongClick={handleSongClick} onAlbumClick={handleAlbumClick} />} />
                    <Route path="/songs" element={<AllSongs onSongClick={handleSongClick} />} />
                    <Route path="/albums" element={<AllAlbums onAlbumClick={handleAlbumClick} />} />
                    <Route path="/artists" element={<AllArtistas onSongClick={handleSongClick} onAlbumClick={handleAlbumClick} />}></Route>

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDenuncias />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </div>

            {shouldShowDrawer && (
                <SongDrawer
                    open={drawerOpen}
                    onDrawerToggle={setDrawerOpen}
                    songId={currentSong?.id}
                    album={currentAlbum}
                />
            )}
        </div>
    );
};

export default PoringaSound;