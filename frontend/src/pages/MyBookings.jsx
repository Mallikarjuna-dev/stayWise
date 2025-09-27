import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import Loader from "../components/Loader";

export default function MyBookings() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["bookings"],
        queryFn: async () => (await client.get("/bookings/my")).data.bookings,
    });

    if (isLoading) return <Loader />;
    if (error) return <p>Error loading bookings</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
            {data.length === 0 && <p>No bookings yet.</p>}
            <div className="space-y-4">
                {data.map((b) => (
                    <div key={b._id} className="border p-4 rounded shadow">
                        <h2 className="font-semibold">{b.property.title}</h2>
                        <p>
                            {new Date(b.checkIn).toLocaleDateString()} -{" "}
                            {new Date(b.checkOut).toLocaleDateString()}
                        </p>
                        <p>Status: {b.status}</p>
                        <p>Total: ₹{b.totalPrice}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
