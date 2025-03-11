import React, { useState, useEffect } from "react";
import { User, Lock, Mail, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/structure/footer";
import { register } from "../../hooks/AuthenticationHooks";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
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

        setPasswordStrength(strength);
        return strength === 4;
    };

    const validateRegisterForm = () => {
        let newErrors = {};

        if (!fullName.trim()) newErrors.fullName = "Username is required.";
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Invalid email format.";
        if (password.length < 8)
            newErrors.password = "Password must be at least 8 characters long.";
        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        if (!validateRegisterForm()) return;

        setLoading(true);
        try {
            await register(fullName, email, password);
            setSuccessMessage("Account created successfully.");
            setErrors({});

            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setPasswordStrength(0);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setErrors({ apiError: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-white flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-blue-800">
                        Create Account
                    </h2>
                    <p className="text-gray-600">
                        Sign up to start your journey
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
                            Username
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
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your username"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div
                            className={`flex items-center px-3.5 py-2 border rounded-md bg-gray-50 focus-within:ring-2 ${
                                errors.email
                                    ? "border-red-500 focus-within:ring-red-500"
                                    : "focus-within:ring-blue-500"
                            }`}
                        >
                            <Mail className="mr-2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="block w-full bg-transparent text-base focus:outline-none"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                    if (confirmPassword && e.target.value !== confirmPassword) {
                                        setErrors({
                                            ...errors,
                                            confirmPassword:
                                                "Passwords do not match.",
                                        });
                                    } else if (confirmPassword) {
                                        const { confirmPassword: _, ...restErrors } = errors;
                                        setErrors(restErrors);
                                    }
                                }}
                                placeholder="Create a password"
                                className="block w-full bg-transparent text-base focus:outline-none"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                        <div
                            className={`h-full rounded-full transition-all ${
                                passwordStrength === 1
                                    ? "bg-red-500 w-1/4"
                                    : passwordStrength === 2
                                        ? "bg-orange-400 w-1/2"
                                        : passwordStrength === 3
                                            ? "bg-yellow-400 w-3/4"
                                            : passwordStrength === 4
                                                ? "bg-green-500 w-full"
                                                : "w-0"
                            }`}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {passwordStrength === 1 && "Very weak"}
                        {passwordStrength === 2 && "Weak"}
                        {passwordStrength === 3 && "Moderate"}
                        {passwordStrength === 4 && "Strong"}
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div
                            className={`flex items-center px-3.5 py-2 border rounded-md bg-gray-50 focus-within:ring-2 ${
                                errors.confirmPassword
                                    ? "border-red-500 focus-within:ring-red-500"
                                    : "focus-within:ring-blue-500"
                            }`}
                        >
                            <Lock className="mr-2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (e.target.value !== password) {
                                        setErrors({
                                            ...errors,
                                            confirmPassword: "Passwords do not match.",
                                        });
                                    } else {
                                        const { confirmPassword: _, ...restErrors } = errors;
                                        setErrors(restErrors);
                                    }
                                }}
                                placeholder="Confirm your password"
                                className="block w-full bg-transparent text-base focus:outline-none"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-2 text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;