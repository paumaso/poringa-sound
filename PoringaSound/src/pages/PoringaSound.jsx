import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SongDrawer from "../components/SongDrawer/SongDrawer";
import AccountInfo from "../components/Account/Account";
import { usePage } from "../context/PageContext";

const PoringaSound = () => {
    const { activePage } = usePage(); // Obtener la página activa desde el contexto

    const renderContent = () => {
        switch (activePage) {
            case "account":
                return <AccountInfo />;
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

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <div
                className="content"
                style={{
                    marginRight: "0",
                    transition: "margin-right 0.3s ease",
                }}
            >
                {renderContent()}
            </div>

            {/* SongDrawer */}
            <SongDrawer />
        </div>
    );
};

export default PoringaSound;