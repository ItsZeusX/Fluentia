const express = require("express");
const User = require("../schemas/User");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

//* PROGRESS
router.post("/", authenticateToken, async (req, res) => {
  try {
    await User.updateOne(
      { email: req.user.email },
      { $pull: { notifications: { id: req.body.id } } }
    );
    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
