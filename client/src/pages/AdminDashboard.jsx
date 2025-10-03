import { useState, useEffect } from "react";
import API from "../utils/API";

export default function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    name: "",
    busNumber: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    price: "",
    totalSeats: "",
  });

  const fetchBuses = async () => {
    const { data } = await API.get("/buses");
    setBuses(data.data);
  };

  const fetchBookings = async () => {
    const { data } = await API.get("/bookings");
    setBookings(data.data);
  };

  useEffect(() => {
    fetchBuses();
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/buses", form);
    alert(data.message);
    setForm({name: "",
    busNumber: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    price: "",
    totalSeats: "",})
    fetchBuses();
    fetchBookings()
    } catch(e) {
      console.log('Error occured while adding bus',e)
    }
  };

  const resetBus = async (id) => {
    if (window.confirm("Reset all bookings for this bus?")) {
      await API.put(`/buses/${id}/reset`);
      fetchBuses();
      fetchBookings();
    }
  };

   const deleteBus = async (id) => {
    if (window.confirm("Are you sure to delete this bus?")) {
      await API.delete(`/buses/${id}`);
      fetchBuses();
      fetchBookings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-bold mb-2">Add New Bus</h3>
        <div className="grid grid-cols-2 gap-3">
          {["name","busNumber","from","to","departure","arrival","price","totalSeats"].map((field) => (
            <input
              key={field}
              type={["departure","arrival"].includes(field) ? "datetime-local" : "text"}
              placeholder={field}
              className="border p-2 rounded"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3">Add Bus</button>
      </form>

      <div>
        <h3 className="text-lg font-bold mb-3">All Buses</h3>
        <div className="grid grid-cols-4 gap-4">
          {buses.map((bus) => (
            <div key={bus._id} className="border p-4 rounded shadow">
              <h4 className="font-bold">{bus.name} ({bus.busNumber})</h4>
              <p>{bus.from} → {bus.to}</p>
              <p>Seats: {bus.totalSeats}</p>
              <div className="flex justify-between">
                <button
                onClick={() => resetBus(bus._id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Reset Bus
              </button>
              <button
                onClick={() => deleteBus(bus._id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Delete Bus
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-bold mb-2">All Bookings (with Bus & User)</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Bus</th>
              <th className="p-2 border">Bus No</th>
              <th className="p-2 border">Route</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Seats</th>
              <th className="p-2 border">Booked At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="text-center">
                  <td className="p-2 border">{b.bus?.name}</td>
                  <td className="p-2 border">{b.bus?.busNumber}</td>
                  <td className="p-2 border">{b.bus?.from} → {b.bus?.to}</td>
                  <td className="p-2 border">{b.user?.userName}</td>
                  <td className="p-2 border">{b.user?.email}</td>
                  <td className="p-2 border">{b.seats.join(", ")}</td>
                  <td className="p-2 border">{new Date(b.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-red-500 text-center" colSpan="7">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
