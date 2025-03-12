import React, { useState } from 'react';
import { addRoomToHotel, deleteRoomFromHotel, addImageToHotel, deleteImageFromHotel } from "../../hooks/AdminHooks.js";
import { getHotelById } from "../../hooks/HotelHooks.js"

const UpdateHotel = () => {
    const [inputHotelId, setInputHotelId] = useState("");
    const [hotelId, setHotelId] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [roomType, setRoomType] = useState("STANDARD");
    const [roomFeatures, setRoomFeatures] = useState([]);
    const [maxOccupancy, setMaxOccupancy] = useState(2);
    const [price, setPrice] = useState(100);

    const [roomToDelete, setRoomToDelete] = useState(null);

    const [isAddingImage, setIsAddingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageDescription, setImageDescription] = useState("");
    const [imageToDelete, setImageToDelete] = useState(null);

    const availableFeatures = [
        "KING_SIZE_BED",
        "AIR_CONDITIONING",
        "FLAT_SCREEN_TV",
        "MINI_FRIDGE",
        "DESK",
        "SAFE",
        "COFFEE_MACHINE",
        "WIFI",
        "ROOM_SERVICE",
        "BALCONY",
        "SHOWER",
        "BATHTUB",
        "HAIR_DRYER",
        "CLOSET",
        "SMOKE_DETECTED",
        "NO_SMOKING",
        "PET_FRIENDLY"
    ];

    const roomTypes = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE"];

    const handleInputChange = (e) => {
        setInputHotelId(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputHotelId.trim()) return;
        await fetchHotelData();
    };

    const fetchHotelData = async () => {
        if (!inputHotelId.trim()) return;
        setLoading(true);
        setError(null);
        setHotel(null);
        setRooms([]);
        setImages([]);

        try {
            const data = await getHotelById(inputHotelId);
            if (data.informations && data.informations.hotel) {
                setHotel(data.informations.hotel);
                setRooms(data.informations.hotel.rooms || []);
                setImages(data.informations.hotel.picture_list || []);
                setHotelId(inputHotelId);
            } else {
                throw new Error("Hotel data structure is invalid");
            }
        } catch (err) {
            setError(err.message || "Failed to fetch hotel data");
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureToggle = (feature) => {
        if (roomFeatures.includes(feature)) {
            setRoomFeatures(roomFeatures.filter(f => f !== feature));
        } else {
            setRoomFeatures([...roomFeatures, feature]);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newRoom = {
                hotelId: hotelId,
                type: roomType,
                features: roomFeatures,
                maxOccupancy: parseInt(maxOccupancy),
                price: parseFloat(price)
            };

            await addRoomToHotel(newRoom);

            await fetchHotelData();

            setIsAddingRoom(false);
            setRoomType("STANDARD");
            setRoomFeatures([]);
            setMaxOccupancy(2);
            setPrice(100);
        } catch (err) {
            setError(err.message || "Failed to add room");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        setLoading(true);
        setError(null);

        try {
            await deleteRoomFromHotel(hotelId, roomId);

            await fetchHotelData();

            setRoomToDelete(null);
        } catch (err) {
            setError(err.message || "Failed to delete room");
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer la sélection d'une image
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setNewImage(selectedImage);

            // Créer un aperçu de l'image
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImage) return;

        setLoading(true);
        setError(null);

        try {
            await addImageToHotel(hotelId, newImage);
            await fetchHotelData();

            setIsAddingImage(false);
            setNewImage(null);
            setImagePreview(null);
            setImageDescription("");
        } catch (err) {
            setError(err.message || "Failed to add image");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        setLoading(true);
        setError(null);

        try {
            await deleteImageFromHotel(hotelId, imageUrl);
            await fetchHotelData();
            setImageToDelete(null);
        } catch (err) {
            setError(err.message || "Failed to delete image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Hotel Management</h1>
            <h2 className="text-xl text-blue-600 italic mb-6">Add or remove rooms and images from a hotel</h2>

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
                            value={inputHotelId}
                            onChange={handleInputChange}
                            disabled={loading}
                            placeholder="Enter a hotel ID"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        disabled={loading || !inputHotelId.trim()}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                        ) : "Search"}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {loading && (
                <div className="text-center py-12">
                    <svg className="animate-spin mx-auto h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            )}

            {!hotel && !loading && !error && (
                <div className="text-center py-12 text-gray-500 bg-white shadow-md rounded-lg">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <p className="text-lg">Enter a hotel ID and click "Search" to manage rooms</p>
                </div>
            )}

            {hotel && !loading && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">{hotel.name}</h2>
                            <p className="text-gray-600">{hotel.address}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setIsAddingRoom(!isAddingRoom);
                                    if (isAddingImage) setIsAddingImage(false);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                            >
                                {isAddingRoom ? 'Cancel' : 'Add Room'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsAddingImage(!isAddingImage);
                                    if (isAddingRoom) setIsAddingRoom(false);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                            >
                                {isAddingImage ? 'Cancel' : 'Add Image'}
                            </button>
                        </div>
                    </div>

                    {isAddingRoom && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
                            <form onSubmit={handleAddRoom}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                        <select
                                            value={roomType}
                                            onChange={(e) => setRoomType(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {roomTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={maxOccupancy}
                                            onChange={(e) => setMaxOccupancy(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (€)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                        {availableFeatures.map(feature => (
                                            <div key={feature} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={feature}
                                                    checked={roomFeatures.includes(feature)}
                                                    onChange={() => handleFeatureToggle(feature)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor={feature} className="ml-2 text-sm text-gray-700">
                                                    {feature.replace(/_/g, ' ')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding...' : 'Add Room'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {isAddingImage && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold mb-4">Add New Image</h3>
                            <form onSubmit={handleAddImage}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-32 object-cover rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={imageDescription}
                                            onChange={(e) => setImageDescription(e.target.value)}
                                            placeholder="Brief description of the image"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading || !newImage}
                                    >
                                        {loading ? 'Uploading...' : 'Add Image'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="mb-10">
                        <h3 className="text-xl font-semibold mb-4">Hotel Images</h3>

                        {images.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-lg">No images available for this hotel</p>
                                <p className="text-sm text-gray-400 mt-1">Use the "Add Image" button to upload one</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {images.map(image => (
                                    <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="relative h-48">
                                            <img
                                                src={image}
                                                alt={"Hotel image"}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                                                {imageToDelete === image.id ? (
                                                    <div className="bg-white p-2 rounded-lg shadow-md">
                                                        <p className="text-sm text-gray-800 mb-2">Confirm deletion?</p>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleDeleteImage(image)}
                                                                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={() => setImageToDelete(null)}
                                                                className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setImageToDelete(image.id)}
                                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm text-gray-700 truncate">{image.description || "No description"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section pour les chambres */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Hotel Rooms</h3>

                        {rooms.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                <p className="text-lg">No rooms available for this hotel</p>
                                <p className="text-sm text-gray-400 mt-1">Use the "Add Room" button to create one</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Room ID</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Occupancy</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Price</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Features</th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {rooms.map(room => (
                                        <tr key={room.id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{room.id}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{room.type}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{room.maxOccupancy}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">€{room.price.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">
                                                <div className="flex flex-wrap gap-1">
                                                    {room.features && room.features.map(feature => (
                                                        <span key={feature} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {feature.replace(/_/g, ' ')}
                                                            </span>
                                                    ))}
                                                    {(!room.features || room.features.length === 0) &&
                                                        <span className="text-gray-400 italic">No features</span>
                                                    }
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-center">
                                                {roomToDelete === room.id ? (
                                                    <div className="flex justify-center items-center space-x-2">
                                                        <span className="text-gray-600 text-xs">Confirm delete?</span>
                                                        <button
                                                            onClick={() => handleDeleteRoom(room.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            onClick={() => setRoomToDelete(null)}
                                                            className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setRoomToDelete(room.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateHotel;