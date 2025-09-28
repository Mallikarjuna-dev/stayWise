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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            </div>
        </div>
    );
}
