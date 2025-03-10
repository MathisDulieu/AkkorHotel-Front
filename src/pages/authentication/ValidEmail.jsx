import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock, Mail, LogIn, RefreshCw } from 'lucide-react';
import { confirmEmail } from '../../hooks/AuthenticationHooks';

const ValidEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const validateEmail = async () => {
            try {
                const response = await confirmEmail(token);
                setStatus('success');
                setMessage(response.message || 'Email successfully validated');

                startRedirectCountdown();
            } catch (error) {
                setStatus('error');
                setMessage(
                    error.message ||
                    'An error occurred during email validation. Please try again.'
                );
            }
        };

        if (token) {
            validateEmail();
        } else {
            setStatus('error');
            setMessage('No validation token provided.');
        }
    }, [token]);

    const startRedirectCountdown = () => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    navigate('/login');
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleResendEmail = () => {
        navigate('/send-validation-email');
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
                        Email Validation
                    </h2>
                    <p className="text-gray-600">
                        {status === 'loading' ? 'Verifying your email address...' :
                            status === 'success' ? 'Your account has been activated' :
                                'There was a problem validating your email'}
                    </p>
                </div>

                <div className="flex justify-center py-8">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center">
                            <Clock className="animate-spin h-16 w-16 text-blue-600 mb-4" />
                            <p className="text-lg text-gray-700">Processing your request...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-30 animate-pulse"></div>
                                <CheckCircle className="h-20 w-20 text-green-600 relative z-10" />
                            </div>
                            <p className="text-lg text-gray-700 mt-6 text-center">Your email has been successfully validated!</p>
                            <p className="text-sm text-blue-600 mt-4">
                                Redirecting to login page in {countdown} seconds...
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-30"></div>
                                <AlertCircle className="h-20 w-20 text-red-600 relative z-10" />
                            </div>
                            <p className="text-lg text-gray-700 mt-6 text-center">{message}</p>
                        </div>
                    )}
                </div>

                {status === 'error' && (
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-md font-medium text-gray-700 mb-2">What can you do now?</h3>
                        <ul className="text-sm text-gray-600 space-y-2 pl-2">
                            <li>• Check that you're using the correct validation link</li>
                            <li>• The validation link may have expired (valid for 24 hours)</li>
                            <li>• You can request a new validation email</li>
                            <li>• Contact support if you continue to experience issues</li>
                        </ul>
                    </div>
                )}

                <div className={`border-t border-gray-200 pt-6 mt-6 ${status === 'success' ? 'opacity-70' : ''}`}>
                    <div className="text-center space-y-4">
                        {status === 'success' ? (
                            <button
                                onClick={handleGoToLogin}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Go to Login
                            </button>
                        ) : status === 'error' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleResendEmail}
                                    className="flex justify-center items-center py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    New Validation
                                </button>
                                <button
                                    onClick={handleGoToLogin}
                                    className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Go to Login
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <span className="inline-block w-8 h-1 bg-gray-200 rounded-full animate-pulse"></span>
                                <span className="inline-block w-8 h-1 mx-1 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                <span className="inline-block w-8 h-1 bg-gray-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute -top-3 -right-3">
                    <div className="bg-blue-100 rounded-full p-2">
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValidEmail;