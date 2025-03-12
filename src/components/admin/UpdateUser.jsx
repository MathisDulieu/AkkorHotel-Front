import React, {useEffect, useState} from 'react';
import {getUserById, updateUserById} from "../../hooks/AdminHooks.js";

const UpdateUser = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showAdminWarning, setShowAdminWarning] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
        isValidEmail: false,
        profileImageUrl: ''
    });
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        if (originalData.role === 'USER' && formData.role === 'ADMIN') {
            setShowAdminWarning(true);
        } else {
            setShowAdminWarning(false);
        }
    }, [formData.role, originalData.role]);

    const handleInputChange = (e) => {
        setUserId(e.target.value);
        setError(null);
        setUser(null);
        setSuccessMessage(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const fetchUser = async (e) => {
        e?.preventDefault();
        if (!userId.trim()) {
            setError("Please enter a user ID");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccessMessage(null);
            const userData = await getUserById(userId);
            const fetchedUser = userData.user.user;
            setUser(fetchedUser);

            const initialFormData = {
                username: fetchedUser.username || '',
                email: fetchedUser.email || '',
                role: fetchedUser.role || '',
                isValidEmail: fetchedUser.isValidEmail || false,
                profileImageUrl: fetchedUser.profileImageUrl || ''
            };

            setFormData(initialFormData);
            setOriginalData(initialFormData);
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null);
            if (err.status === 403) {
                setTimeout(() => {
                    setError("Admin users cannot be retrieved");
                }, 2000);
            } else if (err.status === 404) {
                setTimeout(() => {
                    setError("User not found");
                }, 2000);
            } else {
                setTimeout(() => {
                    setError(`Error: ${err.error || 'Unable to connect to the server'}`);
                }, 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            const changedData = {};

            Object.keys(formData).forEach(key => {
                changedData[key] = formData[key] !== originalData[key] ? formData[key] : null;
            });

            await updateUserById(userId, changedData);

            if (originalData.role === 'USER' && formData.role === 'ADMIN') {
                setSuccessMessage("User promoted to ADMIN successfully. You can no longer edit this user.");
                setUser(null);
            } else {
                setSuccessMessage("User updated successfully");
                await fetchUser();
            }
        } catch (err) {
            console.error("Error updating user:", err);
            setError(`Error updating user: ${err.message || err.error || 'An unknown error occurred'}`);
        } finally {
            setIsSaving(false);
            setShowAdminWarning(false);
        }
    };

    const resetForm = () => {
        if (user) {
            setFormData({...originalData});
        }
    };

    const roleOptions = ["USER", "ADMIN"];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Update User</h1>
            <h2 className="text-xl text-blue-600 italic mb-6">Modify User Information</h2>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <form onSubmit={fetchUser} className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="Search by User ID"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        disabled={isLoading || !userId.trim()}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                        ) : "Find User"}
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
                        <p className="font-medium">Success</p>
                        <p>{successMessage}</p>
                    </div>
                )}

                {showAdminWarning && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded-md">
                        <p className="font-bold">⚠️ Warning</p>
                        <p>If you change this user's role to ADMIN, you will no longer be able to edit or view their information after saving.</p>
                    </div>
                )}

                {user && (
                    <form onSubmit={handleUpdateUser}>
                        <div className="flex flex-col md:flex-row items-start gap-8 mb-6">
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                                    <img
                                        src={formData.profileImageUrl || 'https://via.placeholder.com/150'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Edit User Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                            Role
                                        </label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select role</option>
                                            {roleOptions.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                            Profile Image URL
                                        </label>
                                        <input
                                            type="text"
                                            id="profileImageUrl"
                                            name="profileImageUrl"
                                            value={formData.profileImageUrl}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-4 flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isValidEmail"
                                            name="isValidEmail"
                                            checked={formData.isValidEmail}
                                            onChange={handleFormChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isValidEmail" className="ml-2 block text-sm text-gray-700">
                                            Email Verified
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
                                disabled={isSaving}
                            >
                                Reset Changes
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : "Update User"}
                            </button>
                        </div>
                    </form>
                )}

                {!user && !error && (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <p className="text-lg">Enter a user ID and click "Find User" to edit user details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateUser;