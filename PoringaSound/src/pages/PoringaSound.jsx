import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SongDrawer from "../components/SongDrawer/SongDrawer";

const PoringaSound = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
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
                <h1>Poringa Sound</h1>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima, amet molestiae. Eum atque obcaecati minus placeat quis quibusdam porro ad maiores fugit sed? Numquam non voluptates asperiores itaque et odio?</p>
            </div>

            {/* SongDrawer */}
            <SongDrawer onDrawerToggle={handleDrawerToggle} />
        </div>
    );
};

export default PoringaSound;