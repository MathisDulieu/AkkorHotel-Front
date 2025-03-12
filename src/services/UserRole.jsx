import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from './AuthContext';

const UserRole = ({ element: Component, allowedRoles = [] }) => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);

    const hasPermission = allowedRoles.includes(isAdmin ? 'ADMIN' : 'USER');

    if (!isAuthenticated || !hasPermission) {
        return <Navigate to="/" replace />;
    }

    return Component;
};

export default UserRole;
