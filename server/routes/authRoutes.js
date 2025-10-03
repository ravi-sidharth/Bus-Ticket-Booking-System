const express = require("express");
const router = express.Router();
const { userRegister, userLogin } = require("../Controllers/authController");

router.post("/register", userRegister);
router.post("/login", userLogin);

module.exports = router;
