import React, { useState, useEffect } from "react";
import { User, Lock, AlertCircle } from "lucide-react";
import { AuthContext } from '../../services/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/structure/footer";
import { login } from "../../hooks/AuthenticationHooks";
import { getUserData } from '../../hooks/UserHooks';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/");
        }
    }, [navigate]);

    const isAuthenticated = () => {
        return localStorage.getItem("authToken") !== null;
    };

    const validatePassword = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password))
            strength++;

        return strength === 4;
    };

    const validateLoginForm = () => {
        let newErrors = {};

        if (!email.trim()) newErrors.fullName = "Email is required.";

        if (!validatePassword(password)) {
            newErrors.password =
                "Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and a number or special character.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        if (!validateLoginForm()) return;

        setLoading(true);

        try {
            await login(email, password);
            setSuccessMessage("Login successful. Redirecting...");
            setErrors({});

            const response = await getUserData();

            if (response.informations) {
                const userInfo = {
                    username: response.informations.username || "undefined",
                    profileImageUrl: response.informations.profileImageUrl || "undefined",
                    userRole: response.informations.userRole || "USER",
                    error: response.informations.error
                };

                localStorage.setItem("username", userInfo.username);
                localStorage.setItem("profileImage", userInfo.profileImageUrl);
                localStorage.setItem("userRole", userInfo.userRole);
            }

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            setErrors({ apiError: `ERROR : ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-white flex items-center justify-center relative">
            <div
                className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl"
                style={{ border: "1px solid #e0e0e0" }}
            >
                <div className="text-center">
                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{ color: "#003580" }}
                    >
                        Login
                    </h2>
                    <p className="text-gray-600">
                        Welcome! Please enter your credentials.
                    </p>
                </div>

                {successMessage && (
                    <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-md">
                        <span>{successMessage}</span>
                    </div>
                )}

                {errors.apiError && (
                    <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-md">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{errors.apiError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div
                            className={`flex items-center px-3.5 py-2 border rounded-md bg-gray-50 focus-within:ring-2 ${
                                errors.fullName
                                    ? "border-red-500 focus-within:ring-red-500"
                                    : "focus-within:ring-blue-500"
                            }`}
                        >
                            <User className="mr-2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="block w-full bg-transparent text-base focus:outline-none"
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <div
                            className={`flex items-center px-3.5 py-2 border rounded-md bg-gray-50 focus-within:ring-2 ${
                                errors.password
                                    ? "border-red-500 focus-within:ring-red-500"
                                    : "focus-within:ring-blue-500"
                            }`}
                        >
                            <Lock className="mr-2 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                placeholder="Enter your password"
                                className="block w-full bg-transparent text-base focus:outline-none"
                                autoComplete="current-password"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Remember me
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
