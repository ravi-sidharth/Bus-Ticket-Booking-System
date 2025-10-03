const express = require("express");
const router = express.Router();
const {authenticate} = require("../middlewares/authMiddleware");
const { BookSeat, CancelBooking, GetAllBookings, GetBookingsByUser } = require("../Controllers/bookingController");

router.post("/", authenticate, BookSeat); 
router.delete("/:bookingId", authenticate, CancelBooking);

router.get("/", authenticate, GetAllBookings);

router.get("/user/:userId?", authenticate, GetBookingsByUser);

module.exports = router;
