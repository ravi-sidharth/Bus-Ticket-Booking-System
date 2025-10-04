const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const razorpay = require('../helpers/razorpay')
const crypto = require("crypto");

const cashBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { busId, seats } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

    for (const seatNum of seats) {
      const seat = bus.seats.find(s => s.seatNumber === seatNum);
      if (!seat) return res.status(400).json({ success: false, message: `Seat ${seatNum} does not exist` });
      if (seat.isBooked) return res.status(400).json({ success: false, message: `Seat ${seatNum} is already booked` });
    }

    seats.forEach(seatNum => {
      const seat = bus.seats.find(s => s.seatNumber === seatNum);
      seat.isBooked = true;
      seat.bookedBy = userId;
    });
    const totalAmount = seats.length * bus.price;

    const booking = new Booking({
      bus: busId,
      user: userId,
      seats,
      totalAmount,
      paymentMode: "cash",
      paymentStatus: "paid"
    });

    await booking.save();
    await bus.save();

    return res.json({ 
      success: true, 
      message: "Seats booked successfully!", 
      booking 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { busId, seats } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ 
      success: false, 
      message: "Bus not found" 
    });

    const totalAmount = seats.length * bus.price;
    if (totalAmount < 1) return res.status(400).json({ 
      success: false, 
      message: "Amount must be ≥ ₹1" 
    });

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    return res.json({ 
      success: true, 
      order, 
      busId, 
      seats, 
      totalAmount 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, busId, seats } = req.body;
    const userId = req.user.id;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const digest = hmac.digest("hex");

    if (digest !== razorpaySignature) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed" 
      });
    }

    const bus = await Bus.findById(busId);
    seats.forEach(seatNum => {
      const seat = bus.seats.find(s => s.seatNumber === seatNum);
      seat.isBooked = true;
      seat.bookedBy = userId;
    });
    const totalAmount = seats.length * bus.price;

    const booking = new Booking({
      bus: busId,
      user: userId,
      seats,
      totalAmount,
      paymentMode: "online",
      paymentStatus: "paid",
      razorpayOrderId,
      razorpayPaymentId
    });

    await booking.save();
    await bus.save();

    res.json({ success: true, message: "Seat booked successfully!", booking });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const CancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ 
      success: false, 
      message: "Booking not found" 
    });

    if (booking.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to cancel this booking." 
      });
    }

    const bus = await Bus.findById(booking.bus);
    if (!bus) return res.status(404).json({ 
      success: false, 
      message: "Associated bus not found" 
    });

    for (const seatNumber of booking.seats) {
      const seat = bus.seats.find(s => s.seatNumber === seatNumber);
      if (seat) {
        seat.isBooked = false;
        seat.bookedBy = null;
      }
    }

    await bus.save();
    await booking.remove();

    res.status(200).json({ 
      success: true, 
      message: "Booking cancelled", 
      data: booking 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bus", "name busNumber from to departure price")
      .populate("user", "userName")
      .sort({ seats: 1 }); 
      

    return res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const GetBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const bookings = await Booking.find({ user: userId }).populate("bus");
    res.status(200).json({ 
      success: true, 
      data: bookings 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: err.message
     });
  }

};

module.exports = { 
    cashBooking,
    createOrder, 
    verifyPayment, 
    CancelBooking, 
    getAllBookings, 
    GetBookingsByUser 
  };
