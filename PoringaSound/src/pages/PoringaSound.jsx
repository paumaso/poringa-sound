import React from 'react';
import Navbar from "../components/Navbar/Navbar";

const PoringaSound = () => {
    return (
        <div>
            {/* Navbar  */}
            <Navbar />

            <div className="content">
                <h1>Poringa Sound</h1>
                <p>¡Bienvenido a Poringa Sound! Aquí puedes escuchar música y disfrutar de una experiencia única.</p>
            </div>
        </div>
    );
};

export default PoringaSound;