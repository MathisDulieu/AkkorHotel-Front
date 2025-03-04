import { Link } from "react-router-dom";

const Section = () => {
    return (
        <div className="bg-primary-700">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    <span className="block">
                        Test
                    </span>
                    <span className="block text-primary-200">
                        Loreum ipsum dolor sit amet
                    </span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
                        >
                            Register
                        </Link>
                    </div>
                    <div className="inline-flex rounded-md shadow">
                        <Link
                            to="/profile"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section;
