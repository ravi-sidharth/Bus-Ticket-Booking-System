import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/API";

export default function BusDetails() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMode, setPaymentMode] = useState("cash"); 
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/buses/${id}`).then((res) => setBus(res.data.data));
  }, [id]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat!");
    return;
  }

  if (paymentMode === "cash") {
    try {
      const { data } = await API.post("/bookings/cash", {
        busId: bus._id,
        seats: selectedSeats,
      });

      alert(data.message || "Seats booked successfully!");

      const updatedSeats = bus.seats.map(seat =>
        selectedSeats.includes(seat.seatNumber)
          ? { ...seat, isBooked: true }
          : seat
      );

      setBus({ ...bus, seats: updatedSeats });
      setSelectedSeats([]); // Clear selection
    } catch (err) {
      alert(err.response?.data?.message || "Cash booking failed");
    }
  } else {
    try {
      const { data } = await API.post("/bookings/create-order", {
        busId: bus._id,
        seats: selectedSeats,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Bus Ticket Booking",
        description: `${bus.name} Booking`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await API.post("/bookings/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              busId: bus._id,
              seats: selectedSeats,
            });

            console.log(verifyRes,"veriffy respibnse")

            if (verifyRes.data.success) {
              alert("Payment successful! Seats booked.");

              const updatedSeats = bus.seats.map(seat =>
                selectedSeats.includes(seat.seatNumber)
                  ? { ...seat, isBooked: true }
                  : seat
              );

              setBus({ ...bus, seats: updatedSeats });
              setSelectedSeats([]); 
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Order creation failed");
    }
  }
};


  if (!bus) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <button className="text-blue-500 text-xl mb-4" onClick={() => navigate(-1)}>← Back </button>
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
            onClick={() => toggleSeat(seat.seatNumber)}
            className={`p-2 rounded ${
              selectedSeats.includes(seat.seatNumber)
                ? "bg-yellow-500 text-white"
                : seat.isBooked
                ? "bg-gray-400"
                : "bg-green-500 text-white"
            }`}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <label className="mr-4">
          <input
            type="radio"
            value="cash"
            checked={paymentMode === "cash"}
            onChange={() => setPaymentMode("cash")}
          />{" "}
          Cash
        </label>
        <label>
          <input
            type="radio"
            value="online"
            checked={paymentMode === "online"}
            onChange={() => setPaymentMode("online")}
          />{" "}
          Razorpay
        </label>
      </div>

      <button
        onClick={handleBooking}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Book Selected Seats
      </button>
    </div>
  );
}
