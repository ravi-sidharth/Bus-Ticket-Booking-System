import { useEffect, useState } from "react";
import API from "../utils/API";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate()

  const fetchBookings = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const { data } = await API.get(`/bookings/user/${user.id}`);
    setBookings(data.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (booking) => {
    if (window.confirm("Cancel this booking?")) {
      await API.delete(`/bookings/${booking._id}`, {
        data: { seatNumber: booking.seats[0] },
      });
      fetchBookings();
    }
  };

  return (
    <div className="p-6">
      <button className="text-blue-500 text-xl mb-4" onClick={()=> navigate(-1)}>← Back </button>
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{b.bus.name} ({b.bus.busNumber})</h3>
              <p>{b.bus.from} → {b.bus.to}</p>
              <p>Seat: {b.seats.join(", ")}</p>
              <div className="text-right"><button
                onClick={() => cancelBooking(b)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2 "
              >
                Cancel
              </button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
