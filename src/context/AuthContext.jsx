import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifie si l'utilisateur est déjà connecté (localStorage ou session)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const register = async (userData) => {
        setCurrentUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("user");
    };

    const value = {
        currentUser,
        login,
        logout,
        register,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
