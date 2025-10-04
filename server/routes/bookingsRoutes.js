const express = require("express");
const router = express.Router();
const {authenticate} = require("../middlewares/authMiddleware");
const { cashBooking,createOrder,verifyPayment, CancelBooking, getAllBookings, GetBookingsByUser } = require("../Controllers/bookingController");

router.post("/cash", authenticate,cashBooking );
router.post("/create-order", authenticate, createOrder);
router.post("/verify-payment", authenticate, verifyPayment);
router.delete("/:bookingId", authenticate, CancelBooking);

router.get("/", authenticate, getAllBookings);

router.get("/user/:userId?", authenticate, GetBookingsByUser);

module.exports = router;
