import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { AuthContext } from './services/AuthContext';
import { UserContext } from './services/UserContext';

import PublicRoute from "./services/PublicRoute";

import { getUserData } from './hooks/UserHooks';
import Footer from "./components/structure/footer";
import NotFound from "./pages/common/NotFound.jsx";
import Account from "./pages/user/Account";
import ValidEmail from "./pages/authentication/ValidEmail.jsx";
import SendValidationEmail from "./pages/authentication/SendValidationEmail.jsx";
import Register from './pages/authentication/Register';
import Login from './pages/authentication/Login';
import Home from './pages/common/Home';
import PrivateRoute from "./services/PrivateRoute";
import UserRole from "./services/UserRole";
import AdminDashboard from "./pages/admin/Dashboard.jsx";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({
        username: "undefined",
        profileImageUrl: "undefined",
        userRole: "USER",
        error: null
    });

    const getUserDetails = async () => {
        try {
            const response = await getUserData();

            if (response.informations) {
                const userInfo = {
                    username: response.informations.username || "undefined",
                    profileImageUrl: response.informations.profileImageUrl || "undefined",
                    userRole: response.informations.userRole || "USER",
                    error: response.informations.error
                };

                setUserData(userInfo);
                localStorage.setItem("username", userInfo.username);
                localStorage.setItem("profileImage", userInfo.profileImageUrl);
                localStorage.setItem("userRole", userInfo.userRole);
                setIsAuthenticated(true)
            } else if (response.error) {
                const errorInfo = {
                    username: "undefined",
                    profileImageUrl: "undefined",
                    userRole: "USER",
                    error: response.error.error
                };
                setUserData(errorInfo);
            }
        } catch (error) {
            console.error("Failed to fetch Users:", error);
            const errorInfo = {
                username: "undefined",
                profileImageUrl: "undefined",
                userRole: "USER",
                error: error.message
            };
            setUserData(errorInfo);
        }
    };

    useEffect(() => {
        getUserDetails().then(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            isLoading,
            setIsLoading,
            isAuthenticated,
            setIsAuthenticated,
            isAdmin,
            setIsAdmin,
            user,
            setUser
        }}>
            <UserContext.Provider value={{ user, setUser }}>
                <BrowserRouter>
                    <div className="App">
                        <Routes>
                            {isLoading ? (
                                <Route path="/*" element={<div>Chargement...</div>} />
                            ) : (
                                <Route path="/*" element={<Main isAuthenticated={isAuthenticated} isAdmin={isAdmin} />} />
                            )}
                        </Routes>
                    </div>
                </BrowserRouter>
            </UserContext.Provider>
        </AuthContext.Provider>
    );
}

function Main({ isAuthenticated }) {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <>
            <main className="App-main">
                <Routes>
                    <Route exact path="/" element={<div className="Main"><Home /></div>} />

                    <Route exact path="/register" element={<PublicRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Register /></div>} />} />
                    <Route exact path="/login" element={<PublicRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Login /></div>} />} />
                    <Route exact path="/validate-email/:token" element={<PublicRoute element={<div className="Main"><ValidEmail /></div>} />} />
                    <Route exact path="/send-validation-email" element={<PublicRoute element={<div className="Main"><SendValidationEmail /></div>} />} />

                    <Route exact path="/admin/dashboard" element={<UserRole allowedRoles={['ADMIN']} element={<PrivateRoute isAuthenticated={isAuthenticated} element={<div className="Main"><AdminDashboard /></div>} />} />} />

                    <Route exact path="/my-account" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Account /></div>} />} />
                    <Route exact path="/my-bookings" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Account /></div>} />} />
                    <Route exact path="/book-hotel" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Account /></div>} />} />

                    <Route exact path="*" element={<div className="Main"><NotFound /></div>} />
                </Routes>
            </main>

            {!isAuthPage && !isAdminPage && (
                <footer className="App-footer">
                    <Footer />
                </footer>
            )}
        </>
    );
}
