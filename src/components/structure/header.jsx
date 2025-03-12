import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from "../../services/AuthContext.jsx";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const profileImage = localStorage.getItem('profileImage');
    const userRole = localStorage.getItem('userRole');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleNavigation = (path) => {
        closeDropdown();
        navigate(path);
    };

    const handleLogout = () => {
        closeDropdown();
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <header className="h-20 w-full flex items-center justify-between px-5 space-x-10" style={{ backgroundColor: '#003580' }}>
            <div
                className="text-white text-2xl font-bold cursor-pointer"
                onClick={() => navigate('/')}
            >
                Akkor Hotel
            </div>
            <div className="flex flex-shrink-0 items-center space-x-4 text-white">
                {authToken ? (
                    <>
                        <div className="flex flex-col items-end">
                            <div className="text-lg font-medium">{username}</div>
                        </div>
                        <div className="relative">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="h-13 w-13 rounded-full cursor-pointer border-2 border-blue-400 object-cover"
                                onClick={toggleDropdown}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
                                    <ul className="py-2">
                                        <li>
                                            <button
                                                className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleNavigation('/my-account')}
                                            >
                                                My Account
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleNavigation('/my-bookings')}
                                            >
                                                My Bookings
                                            </button>
                                        </li>
                                        {userRole === 'ADMIN' && (
                                            <li>
                                                <button
                                                    className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100"
                                                    onClick={() => handleNavigation('/admin/dashboard')}
                                                >
                                                    Dashboard
                                                </button>
                                            </li>
                                        )}
                                        <li>
                                            <button
                                                className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100"
                                                onClick={handleLogout}
                                            >
                                                Log Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex space-x-4">
                        <button
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;