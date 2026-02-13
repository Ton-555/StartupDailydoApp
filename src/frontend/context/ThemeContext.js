import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const theme = {
        isDarkMode,
        colors: {
            background: isDarkMode ? '#18181b' : '#fafafa',
            card: isDarkMode ? '#27272a' : '#ffffff',
            text: isDarkMode ? '#f4f4f5' : '#18181b',
            subText: isDarkMode ? '#a1a1aa' : '#71717a',
            border: isDarkMode ? '#3f3f46' : '#e4e4e7',
            primary: '#18181b',
            secondary: '#e4e4e7',
            accent: '#9333ea', // purple
        },
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
