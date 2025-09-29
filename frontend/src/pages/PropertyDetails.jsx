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

    // Fetch property
    const { data: property, isLoading } = useQuery({
        queryKey: ["property", id],
        queryFn: async () => (await client.get(`/properties/${id}`)).data.property,
    });

    // Booking state
    const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
    const [numGuests, setNumGuests] = useState(1);
    const [formError, setFormError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(null);

    // Helpers
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const calculateNights = () => {
        if (!dates.checkIn || !dates.checkOut) return 1;
        const start = new Date(dates.checkIn);
        const end = new Date(dates.checkOut);
        const diff = end - start;
        if (isNaN(diff) || diff <= 0) return 1;
        return Math.max(1, Math.ceil(diff / MS_PER_DAY));
    };

    const validateBooking = () => {
        setFormError(null);
        if (!dates.checkIn || !dates.checkOut) {
            setFormError("Please select check-in and check-out dates.");
            return false;
        }
        const start = new Date(dates.checkIn);
        const end = new Date(dates.checkOut);
        if (isNaN(start) || isNaN(end)) {
            setFormError("Invalid dates selected.");
            return false;
        }
        if (start >= end) {
            setFormError("Check-out date must be after check-in date.");
            return false;
        }
        if (numGuests < 1) {
            setFormError("Guests must be at least 1.");
            return false;
        }
        if (!property || !property.pricePerNight) {
            setFormError("Property price information unavailable.");
            return false;
        }
        return true;
    };

    // Mutation
    const bookingMutation = useMutation({
        mutationFn: async () => {
            const nights = calculateNights();
            const payload = {
                propertyId: id,
                checkIn: dates.checkIn,
                checkOut: dates.checkOut,
                totalPrice: property.pricePerNight * nights,
                guests: numGuests,
            };
            const res = await client.post("/bookings", payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            setBookingSuccess("Booking created successfully!");
            // small delay so user can see success briefly
            setTimeout(() => navigate("/bookings"), 700);
        },
        onError: (err) => {
            console.error("Booking error:", err?.response?.data || err.message || err);
            setFormError(
                err?.response?.data?.message || "Failed to create booking. Please try again."
            );
        },
    });

    // Handler for book button
    const handleBook = () => {
        setBookingSuccess(null);
        if (!validateBooking()) return;
        bookingMutation.mutate();
    };

    if (isLoading) return <Loader />;
    if (!property) return <p className="text-center mt-6">Property not found</p>;

    const nights = calculateNights();
    const previewImage = property.images?.[0] || "https://source.unsplash.com/1600x900/?villa,resort";

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Top: hero + small gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-80">
                        <img
                            src={previewImage}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* small gallery */}
                    {property.images && property.images.length > 1 && (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            {property.images.slice(0, 3).map((img, idx) => (
                                <div key={idx} className="h-24 rounded-lg overflow-hidden shadow-sm">
                                    <img src={img} alt={`${property.title}-${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* title & meta */}
                    <div className="mt-6">
                        <h1 className="text-3xl font-bold">{property.title}</h1>
                        <p className="text-gray-600 mt-1">{property.location}</p>

                        {/* amenities */}
                        {property.amenities?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {property.amenities.map((a, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {a}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* description */}
                        <p className="mt-6 text-gray-800 leading-relaxed">
                            {property.description || "No description available for this property."}
                        </p>
                    </div>
                </div>

                {/* Booking card */}
                <aside className="bg-white border rounded-xl p-5 shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="text-2xl font-semibold text-blue-600">₹{property.pricePerNight} <span className="text-sm font-normal">/ night</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Per stay</p>
                            <p className="text-lg font-medium">₹{property.pricePerNight * nights}</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={dates.checkIn}
                                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // tomorrow
                                onChange={(e) =>
                                    setDates({ ...dates, checkIn: e.target.value, checkOut: "" }) // reset checkout if checkin changes
                                }
                            />
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={dates.checkOut}
                                min={
                                    dates.checkIn
                                        ? new Date(new Date(dates.checkIn).getTime() + 86400000)
                                            .toISOString()
                                            .split("T")[0]
                                        : new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0] // at least 2 days from today if no checkin
                                }
                                onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">Guests</label>
                            <input
                                type="number"
                                min="1"
                                className="w-20 border rounded p-2"
                                value={numGuests}
                                onChange={(e) => setNumGuests(Number(e.target.value))}
                            />
                            <div className="ml-auto text-sm text-gray-500">
                                {nights} night{nights > 1 ? "s" : ""}
                            </div>
                        </div>

                        {formError && <p className="text-sm text-red-600">{formError}</p>}
                        {bookingSuccess && <p className="text-sm text-green-600">{bookingSuccess}</p>}

                        {user ? (
                            <button
                                onClick={handleBook}
                                disabled={bookingMutation.isPending}
                                className={`w-full py-2 rounded-lg text-white font-medium ${bookingMutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {bookingMutation.isPending ? "Booking..." : `Book · ₹${property.pricePerNight * nights}`}
                            </button>
                        ) : (
                            <p className="text-center text-red-600 font-medium">Please login to book this property.</p>
                        )}
                    </div>

                    {/* small note */}
                    <p className="mt-4 text-xs text-gray-500">
                        Free cancellation available up to 24 hours before check-in. Prices and availability are subject to change.
                    </p>
                </aside>
            </div>
        </div>
    );
}
