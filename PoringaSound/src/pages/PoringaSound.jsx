import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { usePage } from "../context/PageContext";
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

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);

    const hideDrawerRoutes = ["/discover", "/admin"];
    const shouldShowDrawer = !hideDrawerRoutes.includes(window.location.pathname);

    const handleSongClick = (song) => {
        setCurrentSong(song);
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
                    <Route path="/" element={<Home onSongClick={handleSongClick} />} />
                    {isAuthenticated && (
                        <Route path="/discover" element={<Discover />} />
                    )}
                    {isAuthenticated && (
                        <Route path="/account" element={<Account onSongClick={handleSongClick} />} />
                    )}
                    <Route path="/song/:id" element={<SongDetails onSongClick={handleSongClick} />} />
                    <Route path="/album/:id" element={<AlbumDetails onSongClick={handleSongClick} />} />
                    <Route path="/artist/:id" element={<ArtistDetails onSongClick={handleSongClick} />} />
                    <Route path="/songs" element={<AllSongs onSongClick={handleSongClick} />} />
                    <Route path="/albums" element={<AllAlbums />} />
                    <Route path="/artists" element={<AllArtistas />}></Route>

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
                />
            )}
        </div>
    );
};

export default PoringaSound;