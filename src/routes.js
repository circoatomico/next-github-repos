import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Main from './pages/Main';
import Repositorio from './pages/Repositorio';

export default function PageRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main/>} exact />
                <Route path="/repositorio" element={<Repositorio/>} exact />
                <Route path="/repositorio/:repositorio" element={<Repositorio/>} exact />
            </Routes>
        </Router>
    )
}