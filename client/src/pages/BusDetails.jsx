import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/API";

export default function BusDetails() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/buses/${id}`).then(res => setBus(res.data.data));
  }, [id]);

  const bookSeat = async (seatNumber) => {
    const { data } = await API.post("/bookings", { busId: bus._id, seats:[seatNumber] });
    alert(data.message);
    window.location.reload();
  };

  if (!bus) return <div className="p-6">Loading...</div>;


  return (
    <div className="p-6">
      <button className="text-blue-500 text-xl mb-4" onClick={()=> navigate(-1)}>← Back </button>
      <h2 className="text-2xl font-bold mb-4">{bus.name} ({bus.busNumber})</h2>
      <p>{bus.from} → {bus.to}</p>
      <p>Price: ₹{bus.price}</p>
      <p>Departure: {new Date(bus.departure).toLocaleString()}</p>

      <h3 className="text-lg font-bold mt-4">Seats</h3>
      <div className="grid grid-cols-8 gap-2 mt-3">
        {bus.seats.map((seat) => (
          <button
            key={seat.seatNumber}
            disabled={seat.isBooked}
            onClick={() => bookSeat(seat.seatNumber)}
            className={`p-2 rounded ${seat.isBooked ? "bg-gray-400" : "bg-green-500 text-white"}`}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
