import React, { /*useContext*/ } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProfileCard from "../components/auth/ProfileCard";

const ProfilePage = () => {
    //const { user, isAuthenticated } = useContext(AuthContext);
    var isAuthenticated = true;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Votre profil
                    </h1>
                    <ProfileCard />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
