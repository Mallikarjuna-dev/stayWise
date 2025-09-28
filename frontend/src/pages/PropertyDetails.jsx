import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function PropertyDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: property, isLoading } = useQuery({
        queryKey: ["property", id],
        queryFn: async () => (await client.get(`/properties/${id}`)).data.property,
    });

    const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
    const [numGuests, setNumGuests] = useState(1);

    const calculateNights = () => {
        if (!dates.checkIn || !dates.checkOut) return 1;
        const start = new Date(dates.checkIn);
        const end = new Date(dates.checkOut);
        const diff = end - start;
        return diff > 0 ? diff / (1000 * 60 * 60 * 24) : 1;
    };

    const bookingMutation = useMutation({
        mutationFn: async () => {
            const nights = calculateNights();
            return (await client.post("/bookings", {
                propertyId: id,
                checkIn: dates.checkIn,
                checkOut: dates.checkOut,
                totalPrice: property.pricePerNight * nights,
                guests: numGuests,
            })).data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["bookings"]);
            navigate("/bookings");
        },
    });

    if (isLoading) return <Loader />;
    if (!property) return <p>Property not found</p>;

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl text-center font-bold mb-2">{property.title}</h1>
            <p className="text-lg mt-3">{property.description}</p>
            <p className="mt-2 font-sans">Location: {property.location}</p>
            <p className="mt-2 text-md text-gray-600 font-semibold">₹{property.pricePerNight} / night</p>

            {user ? (
                <div className="mt-4 border p-4 rounded">
                    <h2 className="font-semibold mb-2">Book this property</h2>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={dates.checkIn}
                            onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                        />
                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={dates.checkOut}
                            onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="mr-2">Guests:</label>
                        <input
                            type="number"
                            min="1"
                            className="border p-1 rounded w-16"
                            value={numGuests}
                            onChange={(e) => setNumGuests(Number(e.target.value))}
                        />
                    </div>
                    <button
                        onClick={() => bookingMutation.mutate()}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                        disabled={bookingMutation.isPending}
                    >
                        Book
                    </button>
                </div>
            ) : (
                <p className="mt-4 font-medium text-red-600">Login to book this property.</p>
            )}
        </div>
    );
}
