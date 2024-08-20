import React, {useState, createContext } from 'react';

export const MainContext = createContext();

export const MainProvider = ({children}) => {
    const [totalIngredients, setTotalIngredients] = useState([]);

    return (
        <MainContext.Provider value={{ totalIngredients, setTotalIngredients }}>
            {children}
        </MainContext.Provider>
    );
};

