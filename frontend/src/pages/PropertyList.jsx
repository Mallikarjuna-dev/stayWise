import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import Loader from "../components/Loader";

export default function PropertyList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["properties"],
        queryFn: async () => (await client.get("/properties")).data.properties,
    });

    if (isLoading) return <Loader />;
    if (error) return <p>Error loading properties</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Properties</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {data.map((p) => (
                    <div
                        key={p._id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200"
                    >
                        {/* Image */}
                        <img
                            src={p.images?.[0] || "https://source.unsplash.com/800x600/?hotel,room"}
                            alt={p.title}
                            className="h-48 w-full object-cover"
                        />

                        {/* Card Body */}
                        <div className="p-4">
                            {/* Title & Location */}
                            <h2 className="text-xl font-bold truncate">{p.title}</h2>
                            <p className="text-gray-600">{p.location}</p>

                            {/* Price */}
                            <p className="mt-2 text-blue-600 font-semibold">
                                ₹{p.pricePerNight} / night
                            </p>

                            {/* Amenities */}
                            {p.amenities?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {p.amenities.slice(0, 3).map((a, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                        >
                                            {a}
                                        </span>
                                    ))}
                                    {p.amenities.length > 3 && (
                                        <span className="text-gray-500 text-xs">+{p.amenities.length - 3} more</span>
                                    )}
                                </div>
                            )}

                            {/* CTA */}
                            <button
                                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                <Link to={`/properties/${p._id}`}>
                                    View Details
                                </Link>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {data.map((p) => (
                    <div key={p._id} className="border rounded shadow p-4">
                        <h2 className="text-lg font-semibold">{p.title}</h2>
                        <p className="text-md">{p.location}</p>
                        <p className="text-sm text-gray-600 font-semibold">
                            ₹{p.pricePerNight} / night
                        </p>
                        <Link
                            to={`/properties/${p._id}`}
                            className="text-blue-600 mt-2 font-medium inline-block"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div> */}
        </div>
    );
}
