import React from 'react';

const Header = () => {
    return (
        <header className="h-60 w-full flex items-center justify-between px-5 space-x-10" style={{ backgroundColor: '#003580' }}>
            <div className="text-white text-2xl font-bold">Akkor Hotel</div>
            <div className="flex flex-shrink-0 items-center space-x-4 text-white">
                <div className="flex flex-col items-end">
                    <div className="text-lg font-medium">Kevin Lafont</div>
                </div>
                <div className="h-13 w-13 rounded-full cursor-pointer bg-gray-200 border-2 border-blue-400"></div>
            </div>
        </header>
    );
};

export default Header;
