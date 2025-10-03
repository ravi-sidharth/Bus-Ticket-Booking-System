import { useEffect, useState } from "react";
import API from "../utils/API";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    API.get("/buses").then(res => setBuses(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Available Buses</h2>
      <div className="grid grid-cols-4 gap-4">
        {buses.map((bus) => (
          <div key={bus._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{bus.name} ({bus.busNumber})</h3>
            <p>{bus.from} → {bus.to}</p>
            <p>Departure: {new Date(bus.departure).toLocaleString()}</p>
            <Link to={`/bus/${bus._id}`} className="text-blue-600 underline">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
