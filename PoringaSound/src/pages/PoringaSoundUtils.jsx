import React from "react";
import Account from "../components/Account/Account";
import Home from "../components/Home/Home";
import SongDetails from "../components/SongDetails/SongDetails";

export const renderContent = (activePage, selectedSongId, handleSongClick, handleSongDetailsClick) => {
    switch (activePage) {
        case "home":
            return <Home onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} />;
        case "account":
            return <Account onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} />;
        case "song":
            return <SongDetails onSongClick={handleSongClick} onDetailsClick={handleSongDetailsClick} songId={selectedSongId} />;
        case "album":
            return (
                <div>
                    <h1>Album</h1>
                </div>
            );
        case "list":
            return (
                <div>
                    <h1>List</h1>
                </div>
            );
        case "ArtistProfile":
            return (
                <div>
                    <h1>Artist</h1>
                </div>
            );
        case "default":
        default:
            return (
                <div>
                    <h1>Poringa Sound</h1>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima, amet molestiae. Eum atque obcaecati minus placeat quis quibusdam porro ad maiores fugit sed? Numquam non voluptates asperiores itaque et odio?</p>
                </div>
            );
    }
};