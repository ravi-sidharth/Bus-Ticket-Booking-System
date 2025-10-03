import React, { useEffect, useState } from "react";
import API from "../utils/API";
import { Link } from "react-router-dom";

export default function Home() {
  const [buses, setBuses] = useState([]);

  const fetchAll = async () => {
    const res = await API.get("/buses");
    setBuses(res.data.data || []);
  };
  useEffect(() => { fetchAll(); }, []);

  return (
    <div>
      <h3>Available Buses</h3>
      <ul className="grid grid-cols-4">
        {buses.map(b => (
          <li key={b._id}>
            <Link to={`/bus/${b._id}`}>{b.name} - {b.busNumber} | {b.from} → {b.to} | {new Date(b.journeyDate).toLocaleDateString()}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
