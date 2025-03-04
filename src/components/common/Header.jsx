import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const currentUser = false;
    const handleLogout = () => {
        navigate("/");
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center"
                        >
                            <Logo />
                            <span className="ml-2 text-xl font-bold text-primary-700">
                                VotreEntreprise
                            </span>
                        </Link>
                    </div>

                    {/* Navigation sur desktop */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="space-x-4">
                            <Link
                                to="/"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-700"
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/services"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-700"
                            >
                                Services
                            </Link>
                            <Link
                                to="/about"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-700"
                            >
                                À propos
                            </Link>
                            <Link
                                to="/contact"
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-700"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/login"
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Connexion
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Inscription
                            </Link>
                        </div>
                    </div>

                    {/* Bouton de menu mobile */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            <span className="sr-only">Ouvrir le menu</span>
                            {isMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Accueil
                        </Link>
                        <Link
                            to="/services"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Services
                        </Link>
                        <Link
                            to="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            À propos
                        </Link>
                        <Link
                            to="/contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Contact
                        </Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        {currentUser ? (
                            <div className="space-y-1">
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Mon Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
