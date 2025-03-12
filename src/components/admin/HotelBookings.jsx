import React, { useState } from 'react';
import { format } from 'date-fns';
import { getHotelBookings } from "../../hooks/AdminHooks.js";

const HotelBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inputHotelId, setInputHotelId] = useState("");
    const [hotelId, setHotelId] = useState(null);

    const handleInputChange = (e) => {
        setInputHotelId(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputHotelId.trim()) return;

        await fetchHotelBookings();
    };

    const fetchHotelBookings = async () => {
        if (!inputHotelId.trim()) return;
        setLoading(true);
        setError(null);

        try {
            const data = await getHotelBookings(inputHotelId);
            setBookings(data.informations.bookings || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        setHotelId(inputHotelId);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Search for bookings</h1>
            <h2 className="text-xl text-blue-600 italic mb-6">Find bookings by hotel</h2>

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

            <div className="bg-white shadow-md rounded-lg p-6">
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
                        <p className="mt-2 text-gray-600">Loading bookings...</p>
                    </div>
                )}

                {hotelId && bookings.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-lg">No bookings found for this hotel</p>
                    </div>
                )}

                {!hotelId && !error && !loading && (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                        <p className="text-lg">Enter a hotel ID and click "Search" to view bookings</p>
                    </div>
                )}

                {bookings.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            Hotel's bookings {hotelId}
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {bookings.map((booking) => (
                                <BookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const BookingCard = ({ booking }) => {
    const formatDate = (dateString) => format(new Date(dateString), 'MM/dd/yyyy HH:mm');

    const getStatusBadgeColor = (status) => {
        switch(status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const hotelImage = booking.hotel.picture_list?.[0] || "https://via.placeholder.com/400x300?text=No+Image";

    return (
        <div className="flex flex-col md:flex-row rounded-xl bg-white shadow-md h-full overflow-hidden">
            <div className="md:w-2/5 h-full">
                <img
                    src={hotelImage}
                    alt={booking.hotel.name}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h6 className="text-pink-500 uppercase font-semibold">Guest: {booking.userId}</h6>
                    <h4 className="text-xl font-semibold">
                        {booking.hotelRoom.type} - {booking.guests} {booking.guests > 1 ? 'people' : 'person'}
                    </h4>
                    <p className="mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(booking.status)}`}>
                            {booking.status}
                        </span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        <div className="p-2 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500">Check-out</p>
                            <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500">Total price</p>
                            <p className="font-medium">{booking.totalPrice}€</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500">Payment status</p>
                            <p className="font-medium">
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                    booking.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {booking.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelBookings;