import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Navigation = ({ isAuthenticated }) => {
    return (
        <nav className="flex items-center justify-between py-4">
            <Logo />
            <div className="flex space-x-6">
                <Link
                    to="/"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                    Accueil
                </Link>
                <Link
                    to="/features"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                    Fonctionnalités
                </Link>
                <Link
                    to="/testimonials"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                    Témoignages
                </Link>
                {isAuthenticated ? (
                    <Link
                        to="/profile"
                        className="text-gray-700 hover:text-indigo-600 font-medium"
                    >
                        Profil
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-indigo-600 font-medium"
                        >
                            Connexion
                        </Link>
                        <Link
                            to="/register"
                            className="text-gray-700 hover:text-indigo-600 font-medium"
                        >
                            Inscription
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
