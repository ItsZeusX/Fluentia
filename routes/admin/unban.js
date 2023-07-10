const express = require("express");
const authenticateToken = require("../../middleware/authenticateToken");
const sendEmail = require("../../misc/email");
const router = express.Router();

const User = require("../../schemas/User");

router.post("/", async (req, res) => {
  try {
    await User.updateOne({ email: req.body.email }, { banned: false });

    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.json({ message: error });
  }
});
module.exports = router;
