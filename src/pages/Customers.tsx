import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";


export default function Customers () {
    const { currentUser } = useAuth();

    useEffect(() => {console.log(currentUser)}, [currentUser]);
    return  (<div className="p-4">
        
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <p>Manage your customers here.</p>
    </div>);
}