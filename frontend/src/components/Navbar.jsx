import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-blue-600 text-white p-4 px-8 flex justify-between items-center">
            <Link to="/" className="font-bold text-xl">StayWise</Link>
            <div className="flex gap-4 font-medium items-center">
                <Link to="/properties">Properties</Link>
                {user ? (
                    <>
                        <Link to="/bookings">My Bookings</Link>

                        {user.role === "admin" && (
                            <>
                                <Link to="/admin/properties">Admin Properties</Link>
                                <Link to="/admin/bookings">All Bookings</Link>
                            </>
                        )}
                        <button
                            onClick={() => { logout(); navigate("/login"); }}
                            className="bg-white text-blue-600 px-3 py-1 rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
