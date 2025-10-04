const express = require("express");
const router = express.Router();
const {authenticate,isAdmin} = require("../middlewares/authMiddleware");
const {
  AddBus, GetAllBuses, GetBusById, DeleteBus, ResetBus
} = require("../Controllers/busController");

router.get("/", GetAllBuses);
router.get("/:id", GetBusById);

router.post("/", authenticate, isAdmin, AddBus);
router.delete("/:id", authenticate, isAdmin, DeleteBus);
router.put("/:id/reset", authenticate, isAdmin, ResetBus);

module.exports = router;

                                  