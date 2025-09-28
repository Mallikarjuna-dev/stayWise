import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";
import { useState } from "react";

export default function AdminDashboard() {
    const queryClient = useQueryClient();

    const { data: properties, isLoading: loadingProps } = useQuery({
        queryKey: ["properties"],
        queryFn: async () => {
            const { data } = await client.get("/properties");
            return Array.isArray(data) ? data : data.data || [];
        },
    });

    const { disLoading: loadingBookings } = useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            const { data } = await client.get("/bookings");
            // return Array.isArray(data) ? data : data.data || [];
            if (!data) return [];
            if (Array.isArray(data)) return data;
            return data.bookings || [];

        },
    });

    const addPropertyMutation = useMutation({
        mutationFn: async (newProperty) => {
            const { data } = await client.post("/properties", newProperty);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
            setNewProperty({
                title: "",
                description: "",
                location: "",
                pricePerNight: 0,
                images: [],
                amenities: [],
            });
        },
    });

    const deletePropertyMutation = useMutation({
        mutationFn: async (id) => {
            await client.delete(`/properties/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
    });

    const [newProperty, setNewProperty] = useState({
        title: "",
        description: "",
        location: "",
        pricePerNight: 0,
        images: [],
        amenities: [],
    });

    if (loadingProps || loadingBookings) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Properties</h3>
                <ul className="space-y-2">
                    {properties?.map((p) => (
                        <li
                            key={p._id}
                            className="flex justify-between items-center border p-2 rounded"
                        >
                            <span>
                                {p.title} — ₹{p.pricePerNight}/night
                            </span>
                            <button
                                onClick={() => deletePropertyMutation.mutate(p._id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 border p-4 rounded">
                    <h4 className="font-semibold mb-2">Add New Property</h4>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newProperty.title}
                        onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                        className="border p-1 rounded w-full mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={newProperty.location}
                        onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                        className="border p-1 rounded w-full mb-2"
                    />
                    <input
                        type="number"
                        placeholder="Price per night"
                        value={newProperty.pricePerNight}
                        onChange={(e) => setNewProperty({ ...newProperty, pricePerNight: Number(e.target.value) })}
                        className="border p-1 rounded w-full mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Image URLs (comma separated)"
                        value={newProperty.images.join(",")}
                        onChange={(e) =>
                            setNewProperty({ ...newProperty, images: e.target.value.split(",") })
                        }
                        className="border p-1 rounded w-full mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Amenities (comma separated)"
                        value={newProperty.amenities.join(",")}
                        onChange={(e) =>
                            setNewProperty({ ...newProperty, amenities: e.target.value.split(",") })
                        }
                        className="border p-1 rounded w-full mb-2"
                    />
                    <textarea
                        placeholder="Description"
                        value={newProperty.description}
                        onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                        className="border p-1 rounded w-full mb-2"
                    />
                    <button
                        onClick={() => addPropertyMutation.mutate(newProperty)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                        Add Property
                    </button>
                </div>
            </div>
        </div>
    );
}
