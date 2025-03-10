import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../hooks/AdminHooks.js';

const GetUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 10;

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers(keyword, currentPage, pageSize);

            const responseKey = Object.keys(response)[0];
            const data = response[responseKey];

            setUsers(data.users || []);
            setTotalPages(data.totalPages);
            setError(data.error);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch users");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [currentPage, keyword]);

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearch = (e) => {
        setKeyword(e.target.value);
        setCurrentPage(0);
    };

    return (
        <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-medium text-blue-800">Users</h2>
                </div>
                <div className="mt-4 sm:mt-0">
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={keyword}
                        onChange={handleSearch}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="mt-6 text-center">Loading...</div>
            ) : error ? (
                <div className="mt-6 text-center text-red-600">{error}</div>
            ) : (
                <>
                    <div className="flex flex-col mt-6">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 px-3 text-sm font-normal text-left text-blue-700 w-1/4">
                                                User ID
                                            </th>
                                            <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left text-blue-700">
                                                Username
                                            </th>
                                            <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left text-blue-700">
                                                Email
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-3 py-4 text-sm font-medium text-blue-800 whitespace-nowrap w-1/3">
                                                        {user.id}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                        <div className="flex items-center gap-x-2">
                                                            <img className="object-cover w-8 h-8 rounded-full" src={user.profileImageUrl} alt="" />
                                                            <div>
                                                                <h2 className="text-sm font-medium text-blue-800">{user.username}</h2>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                        {user.email}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-4 text-sm text-center text-gray-500">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className={`flex items-center px-5 py-2 text-sm text-blue-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                            </svg>
                            <span>previous</span>
                        </button>

                        <div className="items-center hidden md:flex gap-x-3">
                            <span className="px-2 py-1 text-sm text-blue-600">
                                Page {currentPage + 1} of {totalPages}
                            </span>
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                            className={`flex items-center px-5 py-2 text-sm text-blue-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span>Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default GetUsers;