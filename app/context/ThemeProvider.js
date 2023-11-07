import React, { createContext, useState } from 'react'

export const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(false);

    const toggleTheme = () => {
        setTheme(prevState => !prevState);
        console.log({theme});
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider