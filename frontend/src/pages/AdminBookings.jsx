import { useQuery } from "@tanstack/react-query";
import client from "../api/client";

export default function MyBookings() {

    // For Admin: all users bookings
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            const { data } = await client.get("/bookings");
            // return Array.isArray(data) ? data : data.data || [];
            if (!data) return [];
            if (Array.isArray(data)) return data;
            return data.bookings || [];

        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading bookings</p>;

    return (
        <div className="my-4 max-w-4xl mx-auto text-lg text-gray-700">
            <h1 className="text-2xl font-bold text-center mb-4">All Bookings</h1>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                bookings.map((b) => (
                    <div className="my-3" key={b._id}>
                        Email: {b.user?.email} booked <strong>{b.property?.title}</strong> from (Place) from {b.checkIn} to {b.checkOut} (Dates)
                    </div>
                ))
            )}
        </div>
    );
}
