import React, {useState} from 'react';
import {getUserById} from "../../hooks/AdminHooks.js";

const GetUserById = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setUserId(e.target.value);
        setError(null);
        setUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId.trim()) {
            setError("Please enter a user ID");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const userData = await getUserById(userId);
            setUser(userData.user.user);
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null);
            if (err.status === 403) {
                setError("Admin users cannot be retrieved");
            } else if (err.status === 404) {
                setError("User not found");
            } else {
                setError(`Error: ${err.error || 'Unable to connect to the server'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Get User By ID</h1>
            <h2 className="text-xl text-blue-600 italic mb-6">Retrieve User Information</h2>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
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
                        ) : "Fetch User"}
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

                {user && (
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {user.profileImageUrl && (
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                                    <img
                                        src={user.profileImageUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex-grow">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">User Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">ID</p>
                                    <p className="font-medium">{user.id}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="font-medium">{user.username}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="font-medium">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">Email Verified</p>
                                    <p className="font-medium">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                            user.isValidEmail ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.isValidEmail ? "Yes" : "No"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!user && !error && (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <p className="text-lg">Enter a user ID and click "Fetch User" to see user details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetUserById;