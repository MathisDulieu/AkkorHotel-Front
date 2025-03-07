import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        console.log("Page introuvable");
    }, []);

    return <Navigate to="/" replace />;
};

export default NotFound;