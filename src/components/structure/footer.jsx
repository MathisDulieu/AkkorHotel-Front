import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8" style={{ backgroundColor: '#003580' }}>
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 text-lg">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Useful links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:underline">Home</a></li>
                            <li><a href="/my-account" className="hover:underline">My Account</a></li>
                            <li><a href="/my-bookings" className="hover:underline">My Bookings</a></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                            <li><a href="/cookie-policy" className="hover:underline">Cookie Policy</a></li>
                            <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-semibold">Contact</h3>
                        <p>Email: contact@akkorhotel.com</p>
                        <p>Phone: +33 1 23 45 67 89</p>
                    </div>
                </div>
                <div className="mt-8 text-center text-md">
                    <p>&copy; {new Date().getFullYear()} AkkorHotel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
