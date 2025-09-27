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

    const { data, isLoading } = useQuery({
        queryKey: ["property", id],
        queryFn: async () => (await client.get(`/properties/${id}`)).data.property,
    });

    const [dates, setDates] = useState({ checkIn: "", checkOut: "" });

    const bookingMutation = useMutation({
        mutationFn: async () =>
            (await client.post("/bookings", {
                propertyId: id,
                checkIn: dates.checkIn,
                checkOut: dates.checkOut,
            })).data,
        onSuccess: () => {
            queryClient.invalidateQueries(["bookings"]);
            navigate("/bookings");
        },
    });

    if (isLoading) return <Loader />;
    if (!data) return <p>Property not found</p>;

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
            <p>{data.description}</p>
            <p className="mt-2">Location: {data.location}</p>
            <p className="mt-1">₹{data.pricePerNight} / night</p>

            {user ? (
                <div className="mt-4 border p-4 rounded">
                    <h2 className="font-semibold mb-2">Book this property</h2>
                    <input
                        type="date"
                        className="border p-2 mr-2 rounded"
                        value={dates.checkIn}
                        onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                    />
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={dates.checkOut}
                        onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                    />
                    <button
                        onClick={() => bookingMutation.mutate()}
                        className="bg-blue-600 text-white px-3 py-1 rounded ml-2"
                        disabled={bookingMutation.isPending}
                    >
                        Book
                    </button>
                </div>
            ) : (
                <p className="mt-4 text-red-600">Login to book this property.</p>
            )}
        </div>
    );
}
