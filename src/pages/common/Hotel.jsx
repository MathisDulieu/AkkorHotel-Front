import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getHotelById} from '../../hooks/HotelHooks.js';
import {navigate} from "jsdom/lib/jsdom/living/window/navigation.js";
import {
    AirVent,
    Briefcase,
    Car,
    Cigarette,
    Dumbbell,
    Flame,
    GlassWater,
    PawPrint,
    Plane,
    ShowerHead,
    UtensilsCrossed,
    WavesLadder,
    Wifi
} from 'lucide-react';
import BookingModal from "../../components/home/BookingModal.jsx";

const Hotel = () => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                setLoading(true);
                const response = await getHotelById(hotelId);
                if (response.informations.hotel) {
                    setHotel(response.informations.hotel);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [hotelId, navigate]);

    const handleBookClick = (roomId) => {
        setSelectedRoom(roomId);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <span className="mt-4 text-gray-700">Loading...</span>
                </div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-gray-900">Hotel not found</h3>
                    <p className="mt-2 text-gray-500">We couldn't find the hotel you're looking for.</p>
                </div>
            </div>
        );
    }

    const { name, description, picture_list, amenities, rooms, location } = hotel;

    const formatFeature = (feature) => {
        return feature.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatRoomType = (type) => {
        const types = {
            'SINGLE': 'Single Room',
            'DOUBLE': 'Double Room',
            'TWIN': 'Twin Room',
            'SUITE': 'Suite',
            'FAMILY': 'Family Room',
            'PENTHOUSE': 'Penthouse',
            'EXECUTIVE': 'Executive Room',
            'DELUXE': 'Deluxe Room',
            'STANDARD': 'Standard Room'
        };
        return types[type] || type;
    };

    const formatAmenity = (amenity) => {
        const amenityMap = {
            'WIFI': 'Wi-Fi',
            'POOL': 'Pool',
            'GYM': 'Gym',
            'SPA': 'Spa',
            'PARKING': 'Parking',
            'RESTAURANT': 'Restaurant',
            'AIR_CONDITIONING': 'Air Conditioning',
            'PET_FRIENDLY': 'Pet Friendly',
            'AIRPORT_SHUTTLE': 'Airport Shuttle',
            'BAR': 'Bar',
            'BUSINESS_CENTER': 'Business Center',
            'LAUNDRY': 'Laundry Service',
            'SMOKING_AREA': 'Smoking Area'
        };
        return amenityMap[amenity] || amenity;
    };

    const amenityIcons = {
        'WIFI': <Wifi size={20} />,
        'POOL': <WavesLadder size={20} />,
        'GYM': <Dumbbell size={20} />,
        'SPA': <Flame size={20} />,
        'PARKING': <Car size={20} />,
        'RESTAURANT': <UtensilsCrossed size={20} />,
        'AIR_CONDITIONING': <AirVent size={20} />,
        'PET_FRIENDLY': <PawPrint size={20} />,
        'AIRPORT_SHUTTLE': <Plane size={20} />,
        'BAR': <GlassWater size={20} />,
        'BUSINESS_CENTER': <Briefcase size={20} />,
        'LAUNDRY': <ShowerHead size={20} />,
        'SMOKING_AREA': <Cigarette size={20} />
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 md:p-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-white">{name}</h1>
                        {location && (
                            <p className="text-blue-100 mt-2 flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                {location.city}, {location.country}
                            </p>
                        )}
                    </div>

                    {picture_list && picture_list.length > 0 && (
                        <div className="bg-gray-100 p-4">
                            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
                                <img
                                    src={picture_list[activeImage]}
                                    alt={`${name} - Vue principale`}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                                />
                            </div>
                            {picture_list.length > 1 && (
                                <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                                    {picture_list.map((pic, index) => (
                                        <div
                                            key={index}
                                            className={`cursor-pointer flex-shrink-0 h-16 w-24 md:h-20 md:w-32 rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
                                            onClick={() => setActiveImage(index)}
                                        >
                                            <img
                                                src={pic}
                                                alt={`${name} - ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="md:col-span-2">
                            <div className="prose max-w-none mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Description
                                </h2>
                                <p className="text-gray-600 leading-relaxed">{description}</p>
                            </div>

                            {rooms && rooms.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                        </svg>
                                        Rooms
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {rooms.map(room => (
                                            <div key={room._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                                                <div className="p-5 flex-grow">
                                                    <h3 className="text-lg font-semibold text-gray-800">{formatRoomType(room.type)}</h3>
                                                    <div className="flex items-center mt-2">
                                                        <span className="text-2xl font-bold text-blue-600">{room.price} €</span>
                                                        <span className="text-gray-500 ml-1 text-sm">/ night</span>
                                                    </div>
                                                    <div className="mt-4 flex items-center text-gray-600">
                                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                        </svg>
                                                        <span>Max {room.maxOccupancy} people</span>
                                                    </div>
                                                    {room.features && room.features.length > 0 && (
                                                        <div className="mt-3">
                                                            <h4 className="font-medium text-gray-700 mb-2">Features</h4>
                                                            <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                                {room.features.map((feature, index) => (
                                                                    <li key={index} className="flex items-center text-sm text-gray-600">
                                                                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                        </svg>
                                                                        {formatFeature(feature)}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="px-5 pb-5">
                                                    <button
                                                        onClick={() => handleBookClick(room.id)}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        Book
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-1">
                            {amenities && amenities.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                        </svg>
                                        Amenities
                                    </h2>
                                    <ul className="space-y-2">
                                        {amenities.map((amenity, index) => (
                                            <li key={index} className="flex items-center text-gray-600">
                                                {amenityIcons[amenity] || (
                                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                )}
                                                <span>{formatAmenity(amenity)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {location && (
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        Adresse
                                    </h2>
                                    <address className="not-italic text-gray-600 mb-4">
                                        <p>{location.address}</p>
                                        <p>{location.postalCode} {location.city}</p>
                                        <p>{location.state}, {location.country}</p>
                                    </address>
                                    {location.googleMapsUrl && (
                                        <a
                                            href={location.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                        >
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                            </svg>
                                            View on Google Maps
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                hotelId={hotelId}
                hotelRoomId={selectedRoom}
            />
        </div>
    );
};

export default Hotel;