import React, { useEffect } from 'react';
import './App.css';
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/navbar/Navbar";
import SignUpPage from "./pages/SignUpPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from "react-router-dom";
import CheckAuthenticated from "./services/CheckAuthenticated";
import Footer from "./components/footer/Footer";
import { useDispatch } from "react-redux";
import { refreshAuthentication } from "./services/RefreshAuthentication"


function App() {

    const dispatch = useDispatch()

    // APP BACKGROUND
    useEffect(() => {
        document.body.style.backgroundImage = 'linear-gradient(90deg, var(--dark), var(--gradient))';
    }, []);

    // AUTHENTICATION REFRESH
    useEffect(() => {
        dispatch(refreshAuthentication())
        const refreshInterval = 60 * 1_000;
        const intervalId = setInterval(() => {
            dispatch(refreshAuthentication());
        }, refreshInterval)

        return () => clearInterval(intervalId)
    }, [dispatch])


    return (
        <div className="App">
            <Router>
                <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} exact />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/sign-up" element={<SignUpPage />} />
                        <Route path="/dashboard" element={<CheckAuthenticated><UserDashboardPage /></CheckAuthenticated>} />
                    </Routes>
                    <Routes>

                    </Routes>

                <Footer />
            </Router>
        </div>
    );
}

export default App;
