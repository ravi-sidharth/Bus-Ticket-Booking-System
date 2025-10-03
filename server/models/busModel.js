const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: { 
    type: Number, 
    required: true 
  },
  isBooked: { 
    type: Boolean, 
    default: false 
  },
  bookedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null },
});

const busSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  busNumber: { 
    type: String, 
    required: true, 
   },
  from: { 
    type: String, 
    required: true },
  to: { 
    type: String, 
    required: true 
  },
  departure: { 
    type: String 
  }, 
  arrival: { 
    type: String
  },
  price: { 
    type: Number,
     required: true 
    },
  totalSeats: { 
    type: Number,
    required: true 
  },
  seats: [seatSchema],
  status: { 
    type: String,
    enum: ["Scheduled", "Running", "Completed"], 
    default: "Scheduled" 
  },
}, 
{ timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
