import React from "react";

const DashboardPresentation = () => {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Akkor Hotel Management System - Admin Dashboard</h1>
            <h2 className="text-xl text-blue-600 italic mb-8">Powerful Management for Exceptional Hospitality</h2>

            <p className="mb-8">
                Welcome to the Akkor Hotel Management System's Administrative Dashboard, the central command center designed exclusively for administrators to manage the global network of Akkor Hotels with efficiency and precision.
            </p>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Comprehensive Hotel Management</h3>
                <p className="mb-3">As an administrator, you have complete control over the hotel inventory across the globe:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li><span className="font-medium">Create New Hotels:</span> Add new properties to the Akkor portfolio with detailed information including name, location, comprehensive descriptions, and high-quality image galleries.</li>
                    <li><span className="font-medium">Update Existing Hotels:</span> Keep information fresh and accurate by modifying hotel details, updating amenities, and refreshing images.</li>
                    <li><span className="font-medium">Remove Properties:</span> Seamlessly remove hotels from the system when necessary, with all associated data properly archived.</li>
                </ul>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Booking Oversight</h3>
                <p className="mb-3">Maintain full visibility of all customer interactions:</p>
                <ul className="list-disc ml-6">
                    <li><span className="font-medium">Comprehensive Booking Lists:</span> View all reservations for any hotel in the network, with powerful filtering options.</li>
                    <li><span className="font-medium">Detailed Booking Information:</span> Access complete reservation details including dates, requests, and guest information.</li>
                </ul>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">User Management</h3>
                <p className="mb-3">Take control of the platform's user base with powerful administrative tools:</p>
                <ul className="list-disc ml-6">
                    <li><span className="font-medium">User Search:</span> Quickly locate any user account by ID, email, or username.</li>
                    <li><span className="font-medium">User Information Management:</span> Update user profiles when necessary.</li>
                    <li><span className="font-medium">User Directory:</span> Browse the complete directory of registered users with sorting and filtering capabilities.</li>
                </ul>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Security and Authentication</h3>
                <p className="mb-3">The Admin Dashboard implements rigorous security measures:</p>
                <ul className="list-disc ml-6">
                    <li><span className="font-medium">Role-Based Access Control:</span> Strict role-based permissions ensuring only authorized personnel can access sensitive operations.</li>
                    <li><span className="font-medium">Secure Authentication:</span> Industry-standard JWT authentication with session management.</li>
                </ul>
            </div>

            <div className="text-center mt-12 text-blue-700 font-medium">
                <p>The Akkor Hotel Management System Admin Dashboard – Empowering administrators with the tools they need to deliver exceptional hospitality experiences worldwide.</p>
            </div>
        </div>
    );
};

export default DashboardPresentation;