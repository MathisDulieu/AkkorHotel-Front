import {Navigate} from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, element: Component }) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        return <Navigate to="/login" replace />;
    }

    return isAuthenticated ? Component : <Navigate to="/login" replace />;
};

export default PrivateRoute;
