import React, { useEffect } from 'react';
import './App.css';
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/navbar/Navbar";
import SignUpPage from "./pages/SignUpPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from "react-router-dom";
import CheckAuthenticated from "./services/CheckAuthenticated";
import {AuthProvider} from "./context/AuthContext";
import Footer from "./components/footer/Footer";



function App() {

    useEffect(() => {
        document.body.style.backgroundImage = 'linear-gradient(90deg, var(--dark), var(--gradient))';
    }, []);

    return (
        <div className="App">
            <Router>
                <AuthProvider>
                <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} exact />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/sign-up" element={<SignUpPage />} />
                        <Route path="/dashboard" element={<CheckAuthenticated><UserDashboardPage /></CheckAuthenticated>} />
                    </Routes>
                </AuthProvider>
                    <Routes>

                    </Routes>

                <Footer />
            </Router>
        </div>
    );
}

export default App;
