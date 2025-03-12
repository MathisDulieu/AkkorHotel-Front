import React from 'react';
import {ArrowRight, MapPin} from 'lucide-react';

const HotelCard = ({
                       imageUrl = "https://www.yonder.fr/sites/default/files/styles/lg-insert/public/contenu/destinations/the_nautilus_maldives.jpg?itok=jUb420c7",
                       title = "Luxury Hotel Experience",
                       description = "Discover a world of comfort and elegance in the heart of the city, offering unparalleled amenities and breathtaking views.",
                       price = "199",
                       rating = "4.5",
                       googleMapUrl = "#",
                       hotelAddress = "1234 Ocean View, Maldives",
                       hotelId = "1"
                   }) => {
    return (
        <div className="relative flex w-full flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
            <div className="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700">
                <a href={`/hotel/${hotelId}`} className="w-full h-full">
                    <img
                        src={imageUrl}
                        alt="Hotel"
                        className="w-full h-[300px] object-cover cursor-pointer"
                    />
                </a>
            </div>
            <div className="p-6 w-3/5 flex flex-col justify-between">
                <div>
                    <a href={`/hotel/${hotelId}`} className="block mb-2 font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased cursor-pointer">
                        {title}
                    </a>
                    <p className="mb-4 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
                        {description}
                    </p>
                    <p className="mb-4 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased flex items-center space-x-2 italic text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{hotelAddress}</span>
                    </p>
                    <a
                        href={googleMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        Explore on Google Maps
                    </a>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-gray-900">
                            €{price}/night
                        </div>
                        <div className="flex items-center text-yellow-500">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            <span className="ml-1 text-gray-600">{rating}</span>
                        </div>
                    </div>
                    <button
                        className="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30"
                        type="button"
                    >
                        Book Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
