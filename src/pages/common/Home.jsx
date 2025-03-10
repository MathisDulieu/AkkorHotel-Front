import React, {useEffect, useState} from "react";
import { Globe, User, Bed, RefreshCcw } from "lucide-react";
import Header from "../../components/structure/header.jsx";
import Footer from "../../components/structure/footer.jsx";
import Filters from "../../components/home/Filters.jsx";
import DatePicker from "../../components/home/DatePicker";
import Checkbox from "../../components/home/Checkbox";
import HotelCard from "../../components/home/HotelCard.jsx";
import { fetchHotels } from "../../hooks/HotelHooks.js";

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hotelsMetadata, setHotelsMetadata] = useState({
        hotelsFound: 0,
        totalPages: 0,
        error: null
    });

    const [searchCity, setSearchCity] = useState('');

    const [guestCount, setGuestCount] = useState(1);
    const decrementGuests = () => {
        setGuestCount(Math.max(1, guestCount - 1));
    };
    const incrementGuests = () => {
        setGuestCount(Math.min(20, guestCount + 1));
    };

    const [bedroomCount, setBedroomCount] = useState(1);
    const decrementBedrooms = () => {
        setBedroomCount(Math.max(1, bedroomCount - 1));
    };
    const incrementBedrooms = () => {
        setBedroomCount(Math.min(10, bedroomCount + 1));
    };

    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 2000,
        minPrice: 0,
        maxPrice: 2000
    });
    const [tempMaxPrice, setTempMaxPrice] = useState(priceRange.maxPrice);

    const [starCategories, setStarCategories] = useState({
        oneStar: false,
        twoStars: false,
        threeStars: false,
        fourStars: false,
        fiveStars: false
    });

    const handleStarCategoryChange = (category) => {
        setStarCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const [hotelAmenities, setHotelAmenities] = useState({
        wifi: false,
        pool: false,
        gym: false,
        spa: false,
        parking: false,
        restaurant: false,
        air_conditioning: false,
        pet_friendly: false,
        airport_shuttle: false,
        bar: false,
        business_center: false,
        laundry: false,
        smoking_area: false
    });
    const handleHotelAmenitiesChange = (amenity) => {
        setHotelAmenities(prev => ({
            ...prev,
            [amenity]: !prev[amenity]
        }));
    };

    const handleMinPriceChange = (e) => {
        let newMin = parseInt(e.target.value, 10);
        if (isNaN(newMin)) newMin = 0;
        newMin = Math.max(priceRange.min, Math.min(newMin, priceRange.maxPrice - 50));
        setPriceRange(prev => ({ ...prev, minPrice: newMin }));
    };

    const handleTempMaxPriceChange = (e) => {
        let value = e.target.value;
        setTempMaxPrice(value);
    };

    const handleMaxPriceBlur = () => {
        let newMax = parseInt(tempMaxPrice, 10);
        if (isNaN(newMax)) newMax = priceRange.max;
        newMax = Math.min(priceRange.max, Math.max(newMax, priceRange.minPrice + 50));

        setPriceRange(prev => ({ ...prev, maxPrice: newMax }));
        setTempMaxPrice(newMax);
    };

    const handleFilterRemoval = (filter) => {
        switch(filter.type) {
            case 'city':
                setSearchCity('');
                break;
            case 'guests':
                setGuestCount(1);
                break;
            case 'bedrooms':
                setBedroomCount(1);
                break;
            case 'star':
                setStarCategories(prev => ({
                    ...prev,
                    [filter.value]: false
                }));
                break;
            case 'amenity':
                setHotelAmenities(prev => ({
                    ...prev,
                    [filter.value]: false
                }));
                break;
            case 'price':
                setPriceRange(prev => ({
                    ...prev,
                    minPrice: 0,
                    maxPrice: 2000
                }));
                setTempMaxPrice(2000);
                break;
            default:
                break;
        }
    };

    const goToNextPage = () => {
        if (currentPage < hotelsMetadata.totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const buildRequestData = () => {
        const selectedAmenities = Object.entries(hotelAmenities)
            .filter(([_, isSelected]) => isSelected)
            .map(([key, _]) => key.toUpperCase());

        return {
            page: currentPage,
            pageSize: 10,
            filter: "PRICE_LOW_TO_HIGH",
            filters: {
                oneStar: starCategories.oneStar,
                twoStars: starCategories.twoStars,
                threeStars: starCategories.threeStars,
                fourStars: starCategories.fourStars,
                fiveStars: starCategories.fiveStars,
                hotelAmenities: selectedAmenities,
                minPrice: priceRange.minPrice,
                maxPrice: priceRange.maxPrice,
                guests: guestCount,
                bedrooms: bedroomCount,
                city: searchCity
            }
        };
    };

    const getHotels = async () => {
        try {
            const response = await fetchHotels(buildRequestData());

            if (response.informations) {
                setHotels(response.informations.hotels || []);
                setHotelsMetadata({
                    hotelsFound: response.informations.hotelsFound || 0,
                    totalPages: response.informations.totalPages || 0,
                    error: response.informations.error
                });
            } else if (response.warning) {
                setHotels([]);
                setHotelsMetadata({
                    hotelsFound: 0,
                    totalPages: response.warning.totalPages || 0,
                    error: response.warning.error
                });
            } else if (response.error) {
                setHotels([]);
                setHotelsMetadata({
                    hotelsFound: 0,
                    totalPages: 0,
                    error: response.error.error
                });
            }
        } catch (error) {
            console.error("Failed to fetch hotels:", error);
            setHotels([]);
            setHotelsMetadata({
                hotelsFound: 0,
                totalPages: 0,
                error: error.message
            });
        }
    };

    useEffect(() => {
        getHotels();
    }, [currentPage]);

    return (
        <div className="h-screen w-full bg-white relative flex overflow-hidden">
            <aside
                className="h-full w-115 flex flex-col relative text-white"
                style={{ backgroundColor: '#003580' }}
            >
                <div
                    id="sidebar-content"
                    className="p-4 pt-20 overflow-y-auto flex-grow scrollbar-hide"
                    style={{
                        height: "100%",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                    }}
                >
                    <div className="mb-4">
                        <div className="text-lg font-semibold mb-2">Informations</div>
                        <hr className="border-t border-white/30 mb-4" />
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-white/80 mb-1">City</div>
                        <div className="flex items-center px-3.5 py-2 text-gray-400 group hover:ring-1 hover:ring-white/30 focus-within:!ring-2 ring-inset focus-within:!ring-white rounded-md bg-white/10">
                            <Globe className="mr-2 h-5 w-5 stroke-white/70" />
                            <input
                                className="block w-full appearance-none bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none sm:text-sm sm:leading-6"
                                placeholder="Search city..."
                                type="text"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                maxLength={40}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-white/80 mb-1">Check-in</div>
                        <DatePicker />
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-white/80 mb-1">Check-out</div>
                        <DatePicker />
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-white/80 mb-1">Guest(s)</div>
                        <div className="flex items-center px-3.5 py-2 text-gray-400 group hover:ring-1 hover:ring-white/30 focus-within:!ring-2 ring-inset focus-within:!ring-white rounded-md bg-white/10">
                            <User className="mr-2 h-5 w-5 stroke-white/70" />
                            <div className="flex items-center max-w-[8rem] w-full ml-15">
                                <button
                                    type="button"
                                    onClick={decrementGuests}
                                    className="bg-white/10 hover:bg-white/20 rounded-s-lg p-1 h-9 focus:outline-none"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 18 2">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    value={guestCount}
                                    readOnly
                                    className="bg-transparent border-x-0 h-9 text-center text-white text-sm w-full py-2.5 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={incrementGuests}
                                    className="bg-white/10 hover:bg-white/20 rounded-e-lg p-1 h-9 focus:outline-none"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-white/80 mb-1">Bedrooms</div>
                        <div className="flex items-center px-3.5 py-2 text-gray-400 group hover:ring-1 hover:ring-white/30 focus-within:!ring-2 ring-inset focus-within:!ring-white rounded-md bg-white/10">
                            <Bed className="mr-2 h-5 w-5 stroke-white/70" />
                            <div className="flex items-center max-w-[8rem] w-full ml-15">
                                <button
                                    type="button"
                                    onClick={decrementBedrooms}
                                    className="bg-white/10 hover:bg-white/20 rounded-s-lg p-1 h-9 focus:outline-none"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 18 2">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    value={bedroomCount}
                                    readOnly
                                    className="bg-transparent border-x-0 h-9 text-center text-white text-sm w-full py-2.5 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={incrementBedrooms}
                                    className="bg-white/10 hover:bg-white/20 rounded-e-lg p-1 h-9 focus:outline-none"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-lg font-semibold mb-2 mt-15">Filters</div>
                        <hr className="border-t border-white/30 mb-4" />

                        <div className="mb-4">
                            <div className="text-sm font-medium text-white/80 mb-2">Category</div>
                            <div className="space-y-2">
                                {Object.entries({
                                    oneStar: "1 Star",
                                    twoStars: "2 Stars",
                                    threeStars: "3 Stars",
                                    fourStars: "4 Stars",
                                    fiveStars: "5 Stars"
                                }).map(([category, label]) => (
                                    <div key={category} className="flex items-center">
                                        <Checkbox
                                            id={category}
                                            label={label}
                                            checked={starCategories[category]}
                                            onChange={() => handleStarCategoryChange(category)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-sm font-medium text-white/80 mb-2">Hotel Amenities</div>
                            {Object.entries({
                                wifi: "WiFi",
                                pool: "Swimming Pool",
                                gym: "Fitness Center",
                                spa: "Spa",
                                parking: "Parking",
                                restaurant: "Restaurant",
                                air_conditioning: "Air Conditioning",
                                pet_friendly: "Pet Friendly",
                                airport_shuttle: "Airport Shuttle",
                                bar: "Bar",
                                business_center: "Business Center",
                                laundry: "Laundry",
                                smoking_area: "Smoking Area"
                            }).map(([amenity, label]) => (
                                <div key={amenity} className="mb-2">
                                    <Checkbox
                                        id={amenity}
                                        label={label}
                                        checked={hotelAmenities[amenity]}
                                        onChange={() => handleHotelAmenitiesChange(amenity)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <div className="text-sm font-medium text-white/80 mb-1">Price (per night)</div>
                            <div className="mb-2">
                                <label className="text-white/80 text-sm">Minimum price:</label>
                                <input
                                    type="number"
                                    min={priceRange.min}
                                    max={priceRange.maxPrice - 50}
                                    value={priceRange.minPrice}
                                    onChange={handleMinPriceChange}
                                    className="block w-full px-3 py-2 mt-1 border border-gray-200 rounded text-white text-center"
                                />
                            </div>
                            <div>
                                <label className="text-white/80 text-sm">Maximum price:</label>
                                <input
                                    type="number"
                                    min={priceRange.minPrice + 50}
                                    max={priceRange.max}
                                    value={tempMaxPrice}
                                    onChange={handleTempMaxPriceChange}
                                    onBlur={handleMaxPriceBlur}
                                    className="block w-full px-3 py-2 mt-1 border border-gray-200 rounded text-white text-center"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="w-full h-full flex flex-col">
                <Header />

                <main className="w-full flex-grow overflow-y-auto">
                    <div className="w-full p-4">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-lg font-semibold text-gray-800">
                                    {searchCity ? `${searchCity}: ` : ""}
                                    {hotelsMetadata.hotelsFound} hôtel{hotelsMetadata.hotelsFound !== 1 ? 's' : ''} trouvé{hotelsMetadata.hotelsFound !== 1 ? 's' : ''}
                                </div>
                                <button
                                    onClick={getHotels}
                                    className="flex items-center px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md"
                                >
                                    <RefreshCcw className="h-5 w-5 mr-2" />
                                    Refresh
                                </button>
                            </div>
                            <div className="relative z-10">
                                <Filters
                                    searchCity={searchCity}
                                    guestCount={guestCount}
                                    bedroomCount={bedroomCount}
                                    starCategories={starCategories}
                                    hotelAmenities={hotelAmenities}
                                    priceRange={priceRange}
                                    onFilterRemoval={handleFilterRemoval}
                                />
                            </div>
                            <hr className="my-4 border-t border-gray-500" />
                        </div>

                        <div className="space-y-4">
                            {hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <HotelCard
                                        key={hotel.hotelId}
                                        title={hotel.name}
                                        description={hotel.description}
                                        price={hotel.price}
                                        rating={hotel.stars || 0}
                                        googleMapUrl={hotel.googleMapUrl}
                                        hotelAddress={hotel.address}
                                        hotelId={hotel.hotelId}
                                        imageUrl={hotel.firstPicture}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-lg text-gray-600">
                                        {hotelsMetadata.error || "Aucun hôtel trouvé. Essayez de modifier vos filtres."}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mt-4">
                            <div className="flex items-center gap-8">
                                <button
                                    disabled={currentPage === 0}
                                    onClick={goToPreviousPage}
                                    className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <p className="text-slate-600">
                                    Page <strong className="text-slate-800">{currentPage + 1}</strong> of&nbsp;
                                    <strong className="text-slate-800">{hotelsMetadata.totalPages || 1}</strong>
                                </p>
                                <button
                                    disabled={currentPage >= hotelsMetadata.totalPages - 1}
                                    onClick={goToNextPage}
                                    className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <hr className="my-4 border-t border-gray-500" />
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;