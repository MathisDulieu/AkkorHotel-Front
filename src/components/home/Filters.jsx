import React, { useState, useEffect } from 'react';

const Filters = ({
                     searchCity,
                     guestCount,
                     bedroomCount,
                     starCategories,
                     hotelAmenities,
                     priceRange,
                     onFilterRemoval
                 }) => {
    const [activeFilters, setActiveFilters] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Filter");
    const starLabels = {
        oneStar: "1 Star",
        twoStars: "2 Stars",
        threeStars: "3 Stars",
        fourStars: "4 Stars",
        fiveStars: "5 Stars"
    };

    const filters = [
        { label: "Price ↑", value: "Price: Low to High" },
        { label: "Price ↓", value: "Price: High to Low" },
        { label: "Rating ↓", value: "Sort by Rating" },
    ];

    const handleSelect = (filter) => {
        setSelectedFilter(filter.value);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const newFilters = [];

        if (searchCity) {
            newFilters.push({ type: 'city', label: `City: ${searchCity}`, value: searchCity });
        }

        if (guestCount > 1) {
            newFilters.push({ type: 'guests', label: `Guests: ${guestCount}`, value: guestCount });
        }

        if (bedroomCount > 1) {
            newFilters.push({ type: 'bedrooms', label: `Bedrooms: ${bedroomCount}`, value: bedroomCount });
        }

        Object.entries(starCategories).forEach(([category, isChecked]) => {
            if (isChecked) {
                newFilters.push({
                    type: 'star',
                    label: starLabels[category],
                    value: category
                });
            }
        });

        Object.entries(hotelAmenities).forEach(([amenity, isChecked]) => {
            if (isChecked) {
                newFilters.push({
                    type: 'amenity',
                    label: amenity.replace('_', ' ').split(' ').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' '),
                    value: amenity
                });
            }
        });

        if (priceRange.minPrice > 0 || priceRange.maxPrice < 2000) {
            newFilters.push({
                type: 'price',
                label: `Price: ${priceRange.minPrice}€ - ${priceRange.maxPrice}€`,
                value: { min: priceRange.minPrice, max: priceRange.maxPrice }
            });
        }

        setActiveFilters(newFilters);
    }, [searchCity, guestCount, bedroomCount, starCategories, hotelAmenities, priceRange]);

    const handleRemoveFilter = (filterToRemove) => {
        onFilterRemoval(filterToRemove);

        setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
    };

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-white bg-red-600 rounded-sm"
                        >
                            {filter.label}
                            <button
                                type="button"
                                onClick={() => handleRemoveFilter(filter)}
                                className="inline-flex items-center p-1 ms-2 text-white bg-transparent rounded-xs hover:bg-red-800"
                            >
                                <svg className="w-2 h-2" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="relative inline-block text-left">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                >
                    {selectedFilter}
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        {filters.map((filter) => (
                            <div
                                key={filter.value}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(filter)}
                            >
                                {filter.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filters;