import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ isAuthenticated, element: Component }) => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';

    const authToken = cookiesAccepted
        ? Cookies.get('authToken')
        : localStorage.getItem('authToken');

    if (!authToken) {
        return <Navigate to="/login" replace />;
    }

    return isAuthenticated ? Component : <Navigate to="/login" replace />;
};

export default PrivateRoute;
