const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: "Email already in use" });

    const user = new User({ userName, email, password });
    await user.save();
    return res.status(201).json({ success: true, message: "User registered", data: { id: user._id, email: user.email, role: user.role }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error occured while user registration" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ success: false, message: "User doesn't exist" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password" });

    const payload = { id: user._id, userName: user.userName, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { id: user._id, userName: user.userName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error occured while user login" });
  }
};

module.exports = { userRegister, userLogin };
