import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import "../Styles/header.css"

export default function Header() {
    const [darkMode, setDarkMode] = useState(false)
    return (
        <header>
            <h1>Where in the world</h1>
            <div className="mode-toggle-wrapper" onClick={() => setDarkMode(!darkMode)}>
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon}></FontAwesomeIcon>
                <p>{darkMode ? "Light" : "Dark"} Mode</p>
            </div>
        </header>
    )
}
