import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminBookings() {
    const { user } = useAuth();
    if (!user?.role || user.role !== "admin") return <p>Access denied</p>;

    const { data: bookings, isLoading } = useQuery(["allBookings"], async () => {
        const res = await client.get("/bookings");
        return res.data;
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All Bookings</h1>
            <ul>
                {bookings?.map((b) => (
                    <li key={b._id} className="border p-2 mb-2">
                        <p>User: {b.user.name}</p>
                        <p>Property: {b.property.name}</p>
                        <p>From: {b.startDate} To: {b.endDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
