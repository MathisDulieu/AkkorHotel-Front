import React from "react";
import BookingCard from "../../components/user/BookingCard";
import { useNavigate } from "react-router-dom";
import Header from "../../components/structure/header";

const Bookings = () => {
    const navigate = useNavigate();

    const simulatedBookings = [
        {
            id: 1,
            hotel: {
                imageUrl:
                    "https://www.yonder.fr/sites/default/files/styles/lg-insert/public/contenu/destinations/the_nautilus_maldives.jpg?itok=jUb420c7",
                name: "Luxury Hotel Maldives",
                address: "1234 Ocean View, Maldives",
            },
            checkInDate: "2024-03-10",
            checkOutDate: "2024-03-15",
            totalPrice: 999,
        },
        {
            id: 2,
            hotel: {
                imageUrl: "https://example.com/images/hotel2.jpg",
                name: "Swiss Mountain Hotel",
                address: "5678 Mountain Road, Switzerland",
            },
            checkInDate: "2024-04-01",
            checkOutDate: "2024-04-07",
            totalPrice: 1499,
        },
        {
            id: 3,
            hotel: {
                imageUrl: "https://example.com/images/hotel3.jpg",
                name: "City of Lights Hotel",
                address: "7890 Champs-Élysées, Paris",
            },
            checkInDate: "2024-05-01",
            checkOutDate: "2024-05-05",
            totalPrice: 1299,
        },
    ];

    return (
        <div>
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
                <p className="text-gray-600 mb-6">
                    You have {simulatedBookings.length} booking
                    {simulatedBookings.length > 1 ? "s" : ""}
                </p>

                <div className="space-y-6">
                    {simulatedBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            imageUrl={booking.hotel.imageUrl}
                            hotelName={booking.hotel.name}
                            hotelAddress={booking.hotel.address}
                            checkInDate={booking.checkInDate}
                            checkOutDate={booking.checkOutDate}
                            totalPrice={booking.totalPrice}
                            bookingId={booking.id}
                        />
                    ))}
                </div>

                {simulatedBookings.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">
                            You have no bookings at the moment.
                        </p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            onClick={() => navigate("/")}
                        >
                            Explore Hotels
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
