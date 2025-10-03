const Bus = require("../models/busModel");
const Booking = require("../models/bookingsModel");

const AddBus = async (req, res) => {
  try {
    const { name,busNumber,from,to,departure,arrival,price,totalSeats } = req.body;
    if (!busNumber || !totalSeats) return res.status(400).json({ success: false, message: "busNumber and totalSeats required" });

    const existing = await Bus.findOne({$or :[{name},{busNumber}] });
    if (existing) return res.json({ success: false, message: "Bus already exists" });

    const seats = [];
    for (let i = 1; i <= totalSeats; i++) seats.push({ seatNumber: i });

    const newBus = new Bus({
      name,
      busNumber,
      from,
      to,
      departure,
      arrival,
      price,
      totalSeats,
      seats });
    await newBus.save();
    res.status(201).json({ success: true, message: "Bus created successfully", data: newBus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const GetAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json({ success: true, data: buses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const GetBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate("seats.bookedBy", "userName email");
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });
    res.status(200).json({ success: true, data: bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const DeleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const ResetBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    bus.seats.forEach(seat => {
      seat.isBooked = false;
      seat.bookedBy = null;
    });
    await bus.save();

    await Booking.deleteMany({ bus: bus._id });

    res.status(200).json({
      success: true,
      message: "Bus reset successfully, all bookings deleted",
      data: bus
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Bus reset failed",
      error: err.message
    });
  }
};

module.exports = { AddBus, GetAllBuses, GetBusById, DeleteBus, ResetBus };
