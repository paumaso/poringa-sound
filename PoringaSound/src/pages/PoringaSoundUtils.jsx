import React from "react";
import AccountInfo from "../components/Account/Account";

export const renderContent = (activePage) => {
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