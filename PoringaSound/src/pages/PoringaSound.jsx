import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SongDrawer from "../components/SongDrawer/SongDrawer";
import { usePage } from "../context/PageContext";
import { renderContent } from "./PoringaSoundUtils.jsx";

const PoringaSound = () => {
    const { activePage } = usePage();
    const [drawerOpen, setDrawerOpen] = useState(false); 

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
                {renderContent(activePage)}
            </div>

            {/* SongDrawer */}
            <SongDrawer onDrawerToggle={setDrawerOpen} />
        </div>
    );
};

export default PoringaSound;