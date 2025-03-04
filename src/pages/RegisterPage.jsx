import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import RegistrationForm from "../components/auth/RegistrationForm";

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Créez votre compte
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Déjà inscrit ?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Connectez-vous
                            </Link>
                        </p>
                    </div>
                    <RegistrationForm />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;
