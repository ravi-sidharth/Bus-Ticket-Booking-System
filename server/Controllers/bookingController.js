const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const User = require("../models/usersModel");

const BookSeat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { busId, seats } = req.body;
    if (!busId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: "busId and seats array required" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

    for (const seatNumber of seats) {
      const seat = bus.seats.find(s => s.seatNumber === seatNumber);
      if (!seat) return res.status(400).json({ success: false, message: `Seat ${seatNumber} does not exist` });
      if (seat.isBooked) return res.status(400).json({ success: false, message: `Seat ${seatNumber} is already booked` });
    }

    for (const seatNumber of seats) {
      const seat = bus.seats.find(s => s.seatNumber === seatNumber);
      seat.isBooked = true;
      seat.bookedBy = userId;
    }

    const totalAmount = seats.length * bus.price;

    const booking = new Booking({
      bus: busId,
      user: userId,
      seats,
      totalAmount
    });
    await booking.save();
    await bus.save();

    res.status(201).json({ success: true, message: "Seats booked", data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const CancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not permitted to cancel this booking" });
    }

    const bus = await Bus.findById(booking.bus);
    if (!bus) return res.status(404).json({ success: false, message: "Associated bus not found" });

    for (const seatNumber of booking.seats) {
      const seat = bus.seats.find(s => s.seatNumber === seatNumber);
      if (seat) {
        seat.isBooked = false;
        seat.bookedBy = null;
      }
    }

    await bus.save();
    await booking.remove();

    res.status(200).json({ success: true, message: "Booking cancelled", data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({createdAt :-1}).populate("bus").populate("user", "userName email");
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const GetBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const bookings = await Booking.find({ user: userId }).populate("bus");
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { BookSeat, CancelBooking, GetAllBookings, GetBookingsByUser };
