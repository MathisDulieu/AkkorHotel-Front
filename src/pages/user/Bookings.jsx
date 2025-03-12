import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getUserBookings } from "../../hooks/BookingHooks.js"; // We'll create this hook

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getUserBookings();
            setBookings(data.informations.bookings || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">My Bookings</h1>
            <h2 className="text-xl text-blue-600 italic mb-6">View your current and past reservations</h2>

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
                        <p className="mt-2 text-gray-600">Loading your bookings...</p>
                    </div>
                )}

                {bookings.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-lg">You don't have any bookings yet</p>
                        <button
                            onClick={() => window.location.href = '/hotels'}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                        >
                            Browse Hotels
                        </button>
                    </div>
                )}

                {bookings.length > 0 && (
                    <div>
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
                    <h6 className="text-pink-500 uppercase font-semibold">{booking.hotel.name}</h6>
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
                <div className="mt-4 flex space-x-2">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
                        onClick={() => window.location.href = `/booking/${booking._id}`}
                    >
                        View Details
                    </button>
                    {booking.status === 'PENDING' && (
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
                            onClick={() => {
                                // Implement cancel booking functionality here
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                    console.log('Cancel booking', booking._id);
                                }
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;