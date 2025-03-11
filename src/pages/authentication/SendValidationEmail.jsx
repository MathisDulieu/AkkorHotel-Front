import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Clock, LogIn } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { resendConfirmationEmail } from '../../hooks/AuthenticationHooks.js';

const SendValidationEmail = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [canSend, setCanSend] = useState(true);
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0 && !canSend) {
            setCanSend(true);
        }

        return () => clearTimeout(timer);
    }, [countdown, canSend]);

    const handleSendEmail = async () => {
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!canSend) {
            return;
        }

        setError('');
        setIsLoading(true);
        setCanSend(false);

        try {
            await resendConfirmationEmail(email);

            setIsSent(true);
            setCanSend(false);
            setCountdown(60);

            setTimeout(() => {
                setIsSent(false);
            }, 5000);
        } catch (error) {
            setError(error.message);
            setCanSend(true); // Allow retry if there was an error
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="h-screen w-full bg-white flex items-center justify-center relative">
            <div
                className="w-full max-w-lg p-8 space-y-6 bg-white shadow-lg rounded-xl relative"
                style={{ border: "1px solid #e0e0e0" }}
            >
                <div className="text-center">
                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{ color: "#003580" }}
                    >
                        Account Confirmation
                    </h2>
                    <p className="text-gray-600">
                        Receive a validation link by email to activate your account
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="flex">
                            <div
                                className={`flex items-center px-3.5 py-2 border rounded-l-md bg-gray-50 focus-within:ring-2 flex-grow ${
                                    error ? "border-red-500 focus-within:ring-red-500" : "focus-within:ring-blue-500"
                                }`}
                            >
                                <Mail className="mr-2 h-5 w-5 text-gray-400" />
                                <input
                                    className="block w-full bg-transparent text-base focus:outline-none"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white rounded-r-md flex items-center justify-center ${
                                    canSend
                                        ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                                onClick={handleSendEmail}
                                disabled={!canSend || isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <Clock className="animate-spin h-5 w-5" />
                                    </span>
                                ) : (
                                    <span>Send</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-md">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {isSent && (
                    <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-md">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Confirmation email sent successfully!</span>
                    </div>
                )}

                {!canSend && countdown > 0 && (
                    <div className="text-center p-3 text-sm text-blue-600 bg-blue-50 rounded-md">
                        <Clock className="inline h-4 w-4 mr-1" />
                        <span>You can send another email in {countdown} seconds</span>
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Important Information</h3>
                    <ul className="text-sm text-gray-600 space-y-2 pl-2">
                        <li>• We will send you a validation link to confirm your email address.</li>
                        <li>• The link will be valid for 24 hours.</li>
                        <li>• Please check your inbox and spam folder.</li>
                        <li>• If you don't receive the email, you can request another one after the countdown.</li>
                    </ul>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?
                        </p>
                        <button
                            onClick={handleGoToLogin}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendValidationEmail;