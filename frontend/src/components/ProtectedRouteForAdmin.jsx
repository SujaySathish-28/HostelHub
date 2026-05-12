
import { useEffect, useState } from "react";
import { authenticateForAdmin } from "../services/hostelService"
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRouteForAdmin = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isAuthorizedAsAdmin, setIsAuthorizedAsAdmin] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const auth = async () => {
            const result = await authenticateForAdmin();
            if (result && result.message !== 'Unauthorized' && result.isAuthorizedAsAdmin === true) {
                setIsAuthenticated(result.isAuthenticated);
                setIsAuthorizedAsAdmin(result.isAuthorizedAsAdmin);
            } else {
                setIsAuthenticated(false);
                setIsAuthorizedAsAdmin(false);
            }
        }
        auth();
    }, [])

    if (isAuthenticated === null || isAuthorizedAsAdmin === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated === false || isAuthorizedAsAdmin === false) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }
    return children;
}

export default ProtectedRouteForAdmin;