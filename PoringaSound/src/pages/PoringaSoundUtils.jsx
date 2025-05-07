import React from "react";
import Account from "../components/Account/Account";

export const renderContent = (activePage, handleSongClick) => {
    switch (activePage) {
        case "account":
            return <Account onSongClick={handleSongClick} />;
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