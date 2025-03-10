import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import {
    getUserData,
    updateProfileImage,
    updateUser,
    deleteUser
} from "../../hooks/UserHooks";
import { useNavigate } from "react-router-dom";

function Account() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [userRole, setUserRole] = useState("");
    const [isUsernameModified, setIsUsernameModified] = useState(false);
    const [isEmailModified, setIsEmailModified] = useState(false);
    const [isPasswordModified, setIsPasswordModified] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const getUserDetails = async () => {
        try {
            const response = await getUserData();
            if (response.informations) {
                setUsername(response.informations.username || "");
                setEmail(response.informations.email || "");
                setSelectedImage(response.informations.profileImageUrl || "");
                setUserRole(response.informations.userRole || "USER");
            }
        } catch (error) {
            console.error("Failed to fetch User:", error);
        }
    };

    useEffect(() => {
        getUserDetails().then(() => {
            setIsLoading(false);
        });
    }, []);

    const updateUserDetails = async () => {
        const usernameToUpdate = isUsernameModified ? username : null;
        const emailToUpdate = isEmailModified ? email : null;
        const oldPasswordToUpdate = oldPassword || null;
        const newPasswordToUpdate = newPassword || null;

        try {
            setIsUsernameModified(false);
            setIsEmailModified(false);
            setIsPasswordModified(false);
            await updateUser(usernameToUpdate, emailToUpdate, oldPasswordToUpdate, newPasswordToUpdate);
            setSuccessMessage("Information updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error during update:", error);
            setError("An error occurred during the update.");
            setTimeout(() => setError(""), 6000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPassword === null) {
            if (newPassword !== confirmPassword) {
                setError("The new passwords do not match");
                setTimeout(() => setError(""), 6000);
                return;
            }
            if (newPassword.length < 8) {
                setError("The password must be at least 8 characters long");
                setTimeout(() => setError(""), 6000);
                return;
            }
        }
        setError("");
        updateUserDetails();
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        setIsEditingUsername(false);
        setIsUsernameModified(true);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsEditingEmail(false);
        setIsEmailModified(true);
    };

    const handlePasswordSubmit = (e) => {
        setIsEditingPassword(false);
        setIsPasswordModified(true);
    };

    const handleDeleteAccount = async () => {
        await deleteUser();
        localStorage.removeItem("authToken");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("userRole");
        setShowDeleteModal(false);
        navigate('/');
        window.location.reload();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await updateProfileImage(file);
                getUserDetails();
            } catch (error) {
                setError("Error updating the image.");
                setTimeout(() => setError(""), 6000);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-12">
                    <div className="relative inline-block">
                        <img
                            src={selectedImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                        />
                        <button
                            onClick={() => document.getElementById("fileInput").click()}
                            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600"
                        >
                            <Pencil size={16} />
                        </button>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-center">
                            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                                {userRole}
                            </span>
                        </div>

                        <div className="flex items-center justify-center space-x-2">
                            {isEditingUsername ? (
                                <form onSubmit={handleUsernameSubmit}>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-md"
                                        autoFocus
                                    />
                                </form>
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-900">{username}</h2>
                            )}
                            <button
                                onClick={() => setIsEditingUsername(true)}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>

                        <div className="flex items-center justify-center space-x-2">
                            {isEditingEmail ? (
                                <form onSubmit={handleEmailSubmit}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-md"
                                        autoFocus
                                    />
                                </form>
                            ) : (
                                <p className="text-gray-600">{email}</p>
                            )}
                            <button
                                onClick={() => setIsEditingEmail(true)}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h3>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Old password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNewPassword(value);

                                        if (typingTimeout) {
                                            clearTimeout(typingTimeout);
                                        }

                                        const timeout = setTimeout(() => {
                                            handlePasswordSubmit();
                                        }, 2000);

                                        setTypingTimeout(timeout);
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 text-center">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4 text-center">
                                {successMessage}
                            </div>
                        )}

                        {(isUsernameModified || isEmailModified || isPasswordModified) && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700"
                                >
                                    Save changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700"
                    >
                        Delete account
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Account Deletion</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="py-2 px-4 bg-gray-300 rounded-md text-sm text-gray-800 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="py-2 px-4 bg-red-600 rounded-md text-sm text-white hover:bg-red-700"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Account;
