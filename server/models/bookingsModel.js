const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Bus", required: true 
    },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true },
  seats: [{ 
    type: Number, 
    required: true 
  }],
  totalAmount: { 
    type: Number, 
    default: 0 
  },
}, 
{ timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
