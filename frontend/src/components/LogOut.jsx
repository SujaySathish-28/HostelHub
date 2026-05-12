import { useEffect } from "react"
import { logout } from "../services/hostelService"
import { useNavigate } from "react-router";

const LogOut=()=>{
    
    const navigate = useNavigate();
    const Logout=async ()=>{
        await logout();
    }
    useEffect(()=>{
        try {
            Logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            navigate('/');
        }
    },[])
}

export default LogOut;