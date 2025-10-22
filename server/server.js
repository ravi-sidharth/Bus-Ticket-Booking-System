require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busesRoutes");
const bookingRoutes = require("./routes/bookingsRoutes");
const { ResultApi } = require("./Controllers/resulsApi");
 

const app = express();
const port = process.env.PORT || 5000;

connectToDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.post('/results', ResultApi)
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
