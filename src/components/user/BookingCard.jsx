// import React from "react";
// import {MapPin} from "lucide-react";
// import {useNavigate} from "react-router-dom";
//
// const BookingCard = ({
//     imageUrl,
//     hotelName,
//     hotelAddress,
//     checkInDate,
//     checkOutDate,
//     totalPrice,
//     bookingId,
// }) => {
//     const navigate = useNavigate();
//
//     const handleCardClick = () => {
//         navigate(`/bookings/${bookingId}`);
//     };
//
//     return (
//         <div
//             className="relative flex w-full h-64 flex-row rounded-xl bg-white shadow-lg cursor-pointer transition-transform transform hover:scale-105"
//             onClick={handleCardClick}
//         >
//             <div className="relative w-1/2 h-full overflow-hidden rounded-xl rounded-r-none">
//                 <img
//                     src={imageUrl}
//                     alt="Hotel"
//                     className="w-full h-full object-cover"
//                 />
//             </div>
//             <div className="p-8 w-1/2 flex flex-col justify-between">
//                 <div>
//                     <h2 className="text-2xl font-bold text-blue-gray-900">
//                         {hotelName}
//                     </h2>
//                     <p className="text-gray-500 italic flex items-center mt-2">
//                         <MapPin className="h-5 w-5 mr-2" />
//                         {hotelAddress}
//                     </p>
//                     <p className="text-gray-700 mt-4">
//                         <span className="font-semibold">Check-in:</span>{" "}
//                         {new Date(checkInDate).toLocaleDateString()}
//                     </p>
//                     <p className="text-gray-700">
//                         <span className="font-semibold">Check-out:</span>{" "}
//                         {new Date(checkOutDate).toLocaleDateString()}
//                     </p>
//                 </div>
//                 <div className="text-xl font-bold text-gray-900">
//                     Total: €{totalPrice}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default BookingCard;
