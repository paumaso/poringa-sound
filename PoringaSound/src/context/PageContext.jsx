import React, { createContext, useContext, useState } from "react";

const PageContext = createContext();

export const PageProvider = ({ children }) => {
    const [activePage, setActivePage] = useState("defoult");

    return (
        <PageContext.Provider value={{ activePage, setActivePage }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePage = () => useContext(PageContext);