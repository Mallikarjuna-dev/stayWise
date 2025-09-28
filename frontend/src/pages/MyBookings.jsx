import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import Loader from "../components/Loader";

export default function MyBookings() {
    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            try {
                const res = await client.get("/bookings/my");
                const data = res.data;
                if (!data) return [];
                if (Array.isArray(data)) return data;
                return data.bookings || [];
            } catch (err) {
                console.error("Error fetching bookings:", err);
                return [];
            }
        },
    });

    if (isLoading) return <Loader />;
    if (error) return <p>Error loading bookings</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
            {bookings.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {bookings.map((b) => (
                        <div key={b._id} className="border p-4 rounded shadow">
                            <h2 className="font-semibold">{b.property?.title || "Unknown Property"}</h2>
                            <p>
                                {new Date(b.checkIn).toLocaleDateString()} -{" "}
                                {new Date(b.checkOut).toLocaleDateString()}
                            </p>
                            <p>Status: {b.status}</p>
                            <p>Total: ₹{b.totalPrice}</p>
                        </div>
                    ))}
                </div>
            )};
        </div>
    );
};
