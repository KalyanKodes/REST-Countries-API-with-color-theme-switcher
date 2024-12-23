import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Components/Header';
import Country from './Components/Country';
import Home from './Components/Home';




export default function App() {
    return (
        <>
            {/* Header */}
            <Header />
            {/* Routes to Home and Specific Country */}
            <BrowserRouter>
                <Routes>

                    <Route path='/' element=<Home /> />
                    <Route path='/country' element=<Country /> />

                </Routes>
            </BrowserRouter>
        </>
    )
}
