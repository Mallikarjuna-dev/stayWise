import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function AdminDashboard() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ name: "", description: "", price: "" });

    if (!user?.role || user.role !== "admin") return <p>Access denied</p>;

    // Fetch all properties
    const { data: properties, isLoading } = useQuery(["properties"], async () => {
        const res = await client.get("/properties");
        return res.data;
    });

    // Mutations
    const addProperty = useMutation(
        async () => await client.post("/properties", formData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["properties"]);
                setFormData({ name: "", description: "", price: "" });
            },
        }
    );

    const deleteProperty = useMutation(
        async (id) => await client.delete(`/properties/${id}`),
        { onSuccess: () => queryClient.invalidateQueries(["properties"]) }
    );

    if (isLoading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* Add Property */}
            <div className="mb-6 border p-4 rounded">
                <h2 className="text-xl mb-2">Add Property</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border p-1 mr-2"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border p-1 mr-2"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border p-1 mr-2"
                />
                <button
                    onClick={() => addProperty.mutate()}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    Add
                </button>
            </div>

            {/* Property List */}
            <div>
                <h2 className="text-xl mb-2">All Properties</h2>
                <ul>
                    {properties?.map((prop) => (
                        <li key={prop._id} className="border p-2 flex justify-between items-center mb-2">
                            <div>
                                <p className="font-bold">{prop.name}</p>
                                <p>{prop.description}</p>
                                <p>Price: {prop.price}</p>
                            </div>
                            <div className="flex gap-2">
                                {/* Delete */}
                                <button
                                    onClick={() => deleteProperty.mutate(prop._id)}
                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                                {/* Edit (simplified as prompt) */}
                                <button
                                    onClick={() => {
                                        const name = prompt("Name:", prop.name);
                                        const description = prompt("Description:", prop.description);
                                        const price = prompt("Price:", prop.price);
                                        if (name && description && price) {
                                            client.put(`/properties/${prop._id}`, { name, description, price })
                                                .then(() => queryClient.invalidateQueries(["properties"]));
                                        }
                                    }}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
