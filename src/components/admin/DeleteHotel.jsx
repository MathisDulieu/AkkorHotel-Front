import React, { useState } from 'react';
import {deleteHotel} from "../../hooks/AdminHooks.js";

const DeleteHotel = () => {
    const [hotelId, setHotelId] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleInputChange = (e) => {
        setHotelId(e.target.value);
        setError(null);
        setMessage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hotelId.trim()) {
            setError("Please enter a hotel ID");
            return;
        }

        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            setError(null);

            await deleteHotel(hotelId);

            setIsDeleting(false);
            setShowConfirmation(false);
            setMessage("Hotel successfully deleted");
            setHotelId('');
        } catch (err) {
            console.error("Error while creating the hotel:", err);

            setIsDeleting(false);
            setShowConfirmation(false);

            if (err.status === 404) {
                setError("Hotel not found");
            } else if (err.status === 400) {
                setError("Invalid request parameters");
            } else {
                setError(`Error: ${err.error || 'Unable to connect to the server'}`);
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Delete a Hotel</h1>
            <h2 className="text-xl text-blue-600 italic mb-8">Managing Your Hotel Inventory</h2>

            <div className="mb-8">
                <p className="mb-4">
                    Use this form to delete a hotel from the Akkor Hotel Management system.
                    This action is irreversible and will also remove all associated rooms and reservations.
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="hotelId" className="block text-gray-700 font-medium mb-2">
                            Hotel ID to delete:
                        </label>
                        <input
                            type="text"
                            id="hotelId"
                            value={hotelId}
                            onChange={handleInputChange}
                            disabled={isDeleting || showConfirmation}
                            placeholder="Enter the hotel ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {!showConfirmation && (
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDeleting || !hotelId.trim()}
                        >
                            Delete Hotel
                        </button>
                    )}
                </form>
            </div>

            {showConfirmation && (
                <div className="bg-white shadow-lg rounded-lg p-6 border border-red-200 mb-8">
                    <h3 className="text-xl font-semibold text-red-800 mb-4">Confirm Deletion</h3>
                    <p className="mb-6">
                        Are you sure you want to delete the hotel with ID <span className="font-bold">"{hotelId}"</span>?
                        This action will also remove all associated rooms and cannot be undone.
                    </p>

                    <div className="flex space-x-4">
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition duration-300 disabled:opacity-50"
                            onClick={cancelDelete}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 flex items-center disabled:opacity-50"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : 'Confirm Deletion'}
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {message && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-md">
                    <p className="font-medium">Success</p>
                    <p>{message}</p>
                </div>
            )}

            <div className="mt-12 border-t pt-6 text-center text-blue-700 font-medium">
                <p>Akkor Hotel Management System - Efficient Hotel Management for Exceptional Hospitality</p>
            </div>
        </div>
    );
};

export default DeleteHotel;