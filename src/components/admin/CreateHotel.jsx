import React, { useState } from "react";
import {createHotel} from "../../hooks/AdminHooks.js";

const CreateHotel = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        city: "",
        address: "",
        country: "",
        state: "",
        postalCode: "",
        googleMapsUrl: "",
        stars: 0,
        amenities: []
    });

    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitStatus, setSubmitStatus] = useState("");

    const availableAmenities = [
        { id: "WIFI", label: "Wi-Fi" },
        { id: "POOL", label: "Pool" },
        { id: "GYM", label: "Gym" },
        { id: "SPA", label: "Spa" },
        { id: "PARKING", label: "Parking" },
        { id: "RESTAURANT", label: "Restaurant" },
        { id: "AIR_CONDITIONING", label: "Air Conditioning" },
        { id: "PET_FRIENDLY", label: "Pet Friendly" },
        { id: "AIRPORT_SHUTTLE", label: "Airport Shuttle" },
        { id: "BAR", label: "Bar" },
        { id: "BUSINESS_CENTER", label: "Business Center" },
        { id: "LAUNDRY", label: "Laundry" },
        { id: "SMOKING_AREA", label: "Smoking Area" },
        { id: "ROOM_SERVICE", label: "Room Service" },
        { id: "CONFERENCE_ROOM", label: "Conference Room" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAmenityChange = (amenityId) => {
        if (formData.amenities.includes(amenityId)) {
            setFormData({
                ...formData,
                amenities: formData.amenities.filter(id => id !== amenityId)
            });
        } else {
            setFormData({
                ...formData,
                amenities: [...formData.amenities, amenityId]
            });
        }
    };

    const handleMainImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateImageFile(file)) {
                setMainImage(file);
                setErrors({ ...errors, mainImage: "" });
            } else {
                setMainImage(null);
                setErrors({ ...errors, mainImage: "Invalid image format. Supported formats: JPG, JPEG, PNG, SVG, WEBP" });
            }
        }
    };

    const handleAdditionalImagesChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(validateImageFile);

            if (validFiles.length !== newFiles.length) {
                setErrors({ ...errors, additionalImages: "Some images have an invalid format. Supported formats: JPG, JPEG, PNG, SVG, WEBP" });
            } else {
                setErrors({ ...errors, additionalImages: "" });
            }

            setAdditionalImages([...additionalImages, ...validFiles]);
        }
    };

    const removeAdditionalImage = (index) => {
        setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    };

    const validateImageFile = (file) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"];
        return validTypes.includes(file.type);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = "The hotel name cannot be empty";
        } else if (formData.name.length < 3 || formData.name.length > 25) {
            newErrors.name = "The hotel name must be between 3 and 25 characters";
        } else if (formData.name.includes(" ")) {
            newErrors.name = "The hotel name cannot contain spaces";
        }

        if (formData.stars < 1) {
            newErrors.stars = "Please select the number of stars for the hotel";
        }

        if (formData.description.length > 500) {
            newErrors.description = "The description cannot exceed 500 characters";
        }

        if (!formData.city) newErrors.city = "City is required";
        if (!formData.address) {
            newErrors.address = "Address is required";
        } else if (formData.address.length > 100) {
            newErrors.address = "The address cannot exceed 100 characters";
        }
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) {
            newErrors.state = "State/Region is required";
        } else if (formData.state.length > 50) {
            newErrors.state = "The state/region cannot exceed 50 characters";
        }
        if (!formData.postalCode) {
            newErrors.postalCode = "Postal code is required";
        } else if (formData.postalCode.length > 10) {
            newErrors.postalCode = "The postal code cannot exceed 10 characters";
        }

        if (!formData.googleMapsUrl) {
            newErrors.googleMapsUrl = "Google Maps URL is required";
        } else if (!formData.googleMapsUrl.startsWith("https://")) {
            newErrors.googleMapsUrl = "Google Maps URL must start with 'https://'";
        }

        if (formData.amenities.length === 0) {
            newErrors.amenities = "Please select at least one amenity";
        }

        if (!mainImage) {
            newErrors.mainImage = "A main image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmitMessage("Please correct the errors in the form");
            setSubmitStatus("error");
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage("");
        setSubmitStatus("");

        try {
            await createHotel(formData, mainImage, additionalImages);

            setSubmitMessage("Hotel created successfully!");
            setSubmitStatus("success");

            setFormData({
                name: "",
                description: "",
                city: "",
                address: "",
                country: "",
                state: "",
                postalCode: "",
                googleMapsUrl: "",
                stars: 0,
                amenities: []
            });
            setMainImage(null);
            setAdditionalImages([]);

        } catch (error) {
            console.error("Error while creating the hotel:", error);

            if (error.errors) {
                setSubmitMessage(`Error: ${error.errors.join(", ")}`);
            } else if (error.error) {
                setSubmitMessage(`Error: ${error.error}`);
            } else {
                setSubmitMessage("An error occurred while creating the hotel");
            }

            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCharacterCount = (current, max) => {
        const isExceeded = current > max;
        return (
            <span className={`text-sm ${isExceeded ? 'text-red-500' : 'text-gray-500'}`}>
            {current}/{max} characters
        </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Creating a New Hotel</h1>

            {submitMessage && (
                <div className={`p-4 mb-6 rounded-lg ${submitStatus === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {submitMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700">General Information</h2>

                    <div className="mb-4 flex items-start">
                        <div className="w-3/4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Hotel Name* (no spaces)
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="HotelName"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            <p className="text-xs text-gray-500 mt-1">The name must be between 3 and 25 characters, without spaces.</p>
                        </div>

                        <div className="ml-4 w-1/4 flex flex-col">
                            <label htmlFor="stars" className="block text-sm font-medium text-gray-700 mb-1">
                                Stars
                            </label>
                            <select
                                id="stars"
                                name="stars"
                                value={formData.stars}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.stars ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                            {errors.stars && <p className="text-red-500 text-sm mt-1">{errors.stars}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="A captivating description of your hotel..."
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        <div className="flex justify-end mt-1">
                            {renderCharacterCount(formData.description.length, 500)}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700">Location</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                City*
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Paris"
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                Country*
                            </label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="France"
                            />
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                State*
                            </label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Île-de-France"
                            />
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Postal Code*
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="75001"
                            />
                            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address*
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="123 Peace Street"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700 mb-1">
                            Google Maps Url*
                        </label>
                        <input
                            type="text"
                            id="googleMapsUrl"
                            name="googleMapsUrl"
                            value={formData.googleMapsUrl}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md ${errors.googleMapsUrl ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="https://maps.google.com/?q=MonHotel"
                        />
                        {errors.googleMapsUrl && <p className="text-red-500 text-sm mt-1">{errors.googleMapsUrl}</p>}
                        <p className="text-xs text-gray-500 mt-1">The URL must start with "https://"</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700">Amenities</h2>

                    {errors.amenities && <p className="text-red-500 text-sm mb-3">{errors.amenities}</p>}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {availableAmenities.map((amenity) => (
                            <div key={amenity.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`amenity-${amenity.id}`}
                                    checked={formData.amenities.includes(amenity.id)}
                                    onChange={() => handleAmenityChange(amenity.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`amenity-${amenity.id}`} className="ml-2 text-sm text-gray-700">
                                    {amenity.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700">Photos</h2>

                    <div className="mb-6 p-4 border border-dashed border-blue-300 rounded-lg bg-blue-50">
                        <h3 className="text-lg font-medium mb-2 text-blue-700">Main Image*</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            This image will be displayed as a preview when searching for hotels. A high-quality image is strongly recommended.
                        </p>

                        <div className="flex items-center justify-center flex-col">
                            <label
                                htmlFor="mainImage"
                                className="cursor-pointer bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full text-center hover:bg-gray-50 transition"
                            >
                                {mainImage ? (
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={URL.createObjectURL(mainImage)}
                                            alt="Preview"
                                            className="max-h-48 max-w-full mb-2 rounded"
                                        />
                                        <span className="text-sm text-blue-600">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="mt-2 text-sm text-gray-600">Click to add a main image</span>
                                    </div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="mainImage"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleMainImageChange}
                                className="hidden"
                            />
                        </div>

                        {errors.mainImage && <p className="text-red-500 text-sm mt-3">{errors.mainImage}</p>}
                        <p className="text-xs text-gray-500 mt-3 text-center">Accepted formats: JPG, PNG, WEBP</p>
                    </div>

                    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium mb-2 text-gray-700">Additional Images</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Add more photos to show different parts of your hotel.
                        </p>

                        {additionalImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {additionalImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Image ${index + 1}`}
                                            className="h-24 w-full object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hidden group-hover:block"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-center">
                            <label
                                htmlFor="additionalImages"
                                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                                Add Images
                            </label>
                            <input
                                type="file"
                                id="additionalImages"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAdditionalImagesChange}
                                multiple
                                className="hidden"
                            />
                        </div>

                        {errors.additionalImages && <p className="text-red-500 text-sm mt-3">{errors.additionalImages}</p>}
                        <p className="text-xs text-gray-500 mt-3 text-center">Accepted formats: JPG, PNG, WEBP</p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`py-3 px-8 rounded-lg text-white font-bold text-lg ${
                            isSubmitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creation in progress...
                            </span>
                        ) : (
                            "Create Hotel"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateHotel;