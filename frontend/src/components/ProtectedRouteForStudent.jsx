
import { useEffect, useState } from "react";
import { authenticateForStudent } from "../services/hostelService"
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRouteForStudent = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isAuthorizedAsStudent, setIsAuthorizedAsStudent] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const auth = async () => {
            const result = await authenticateForStudent();
            if (result && result.isAuthenticated === true && result.isAuthorizedAsStudent === true) {
                setIsAuthenticated(true);
                setIsAuthorizedAsStudent(true);
            } else {
                setIsAuthenticated(false);
                setIsAuthorizedAsStudent(false);
            }
        }
        auth();
    }, [])

    if (isAuthenticated === null || isAuthorizedAsStudent === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated === false || isAuthorizedAsStudent === false) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }
    return children;
}

export default ProtectedRouteForStudent;