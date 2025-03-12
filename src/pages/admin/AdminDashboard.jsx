import React, { useState } from 'react';
import {
    LayoutDashboard,
    Building2,
    UserCog,
    PlusCircle,
    FileEdit,
    Trash2,
    CalendarCheck,
    UserSearch,
    Settings,
    UsersRound
} from 'lucide-react';
import DashboardPresentation from "../../components/admin/DashboardPresentation.jsx";
import CreateHotel from "../../components/admin/CreateHotel.jsx";
import UpdateHotel from "../../components/admin/UpdateHotel.jsx";
import DeleteHotel from "../../components/admin/DeleteHotel.jsx";
import GetUserById from "../../components/admin/GetUserById.jsx";
import UpdateUser from "../../components/admin/UpdateUser.jsx";
import GetUsers from "../../components/admin/GetUsers.jsx";
import UserBookings from "../../components/admin/UserBookings.jsx";
import HotelBookings from "../../components/admin/HotelBookings.jsx";

const DashboardList = ({ setActiveContent }) => {
    const [isHotelOpen, setIsHotelOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    return (
        <aside className="h-full" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto" style={{ backgroundColor: '#003580' }}>
                <ul className="space-y-2">
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveContent('dashboard');
                            }}
                        >
                            <LayoutDashboard className="w-6 h-6 text-white transition duration-75" />
                            <span className="ml-3">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="flex items-center w-full p-2 text-base font-normal text-white transition duration-75 rounded-lg group hover:bg-blue-700"
                            onClick={() => setIsHotelOpen(!isHotelOpen)}
                        >
                            <Building2 className="flex-shrink-0 w-6 h-6 text-white transition duration-75" />
                            <span className="flex-1 ml-3 text-left whitespace-nowrap">Hotels</span>
                            <svg
                                className={`w-6 h-6 transition-transform ${isHotelOpen ? 'rotate-180' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        {isHotelOpen && (
                            <ul className="py-2 space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('createHotel');
                                        }}
                                    >
                                        <PlusCircle className="w-5 h-5 mr-3" /> Create a hotel
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('updateHotel');
                                        }}
                                    >
                                        <FileEdit className="w-5 h-5 mr-3" /> Update a hotel
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('deleteHotel');
                                        }}
                                    >
                                        <Trash2 className="w-5 h-5 mr-3" /> Delete a hotel
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('listHotelBookings');
                                        }}
                                    >
                                        <CalendarCheck className="w-5 h-5 mr-3" /> List of bookings
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <button
                            type="button"
                            className="flex items-center w-full p-2 text-base font-normal text-white transition duration-75 rounded-lg group hover:bg-blue-700"
                            onClick={() => setIsUserOpen(!isUserOpen)}
                        >
                            <UserCog className="flex-shrink-0 w-6 h-6 text-white transition duration-75" />
                            <span className="flex-1 ml-3 text-left whitespace-nowrap">Users</span>
                            <svg
                                className={`w-6 h-6 transition-transform ${isUserOpen ? 'rotate-180' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        {isUserOpen && (
                            <ul className="py-2 space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('retrieveUser');
                                        }}
                                    >
                                        <UserSearch className="w-5 h-5 mr-3" /> Retrieve user by ID
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('updateUser');
                                        }}
                                    >
                                        <Settings className="w-5 h-5 mr-3" /> Update user
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('listUsers');
                                        }}
                                    >
                                        <UsersRound className="w-5 h-5 mr-3" /> List users
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center w-full p-2 text-base font-normal text-white rounded-lg hover:bg-blue-700 pl-11"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveContent('listUsersBookings');
                                        }}
                                    >
                                        <CalendarCheck className="w-5 h-5 mr-3" /> List of bookings
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </aside>
    );
};

const DashboardContent = () => (
    <DashboardPresentation />
);

const CreateHotelContent = () => (
    <CreateHotel />
);

const UpdateHotelContent = () => (
    <UpdateHotel />
);

const DeleteHotelContent = () => (
    <DeleteHotel />
);

const ListHotelBookingsContent = () => (
    <HotelBookings />
);

const ListUserBookingsContent = () => (
    <UserBookings />
);

const RetrieveUserContent = () => (
    <GetUserById />
);

const UpdateUserContent = () => (
    <UpdateUser />
);

const ListUsersContent = () => (
    <GetUsers />
);

const AdminDashboard = () => {
    const [activeContent, setActiveContent] = useState('dashboard');

    const renderContent = () => {
        switch (activeContent) {
            case 'createHotel':
                return <CreateHotelContent />;
            case 'updateHotel':
                return <UpdateHotelContent />;
            case 'deleteHotel':
                return <DeleteHotelContent />;
            case 'listHotelBookings':
                return <ListHotelBookingsContent />;
            case 'retrieveUser':
                return <RetrieveUserContent />;
            case 'updateUser':
                return <UpdateUserContent />;
            case 'listUsers':
                return <ListUsersContent />;
            case 'listUsersBookings':
                return <ListUserBookingsContent />
            case 'dashboard':
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-64 h-screen sticky top-0">
                <DashboardList setActiveContent={setActiveContent} />
            </div>
            <div className="flex-1 p-6 bg-gray-100">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;