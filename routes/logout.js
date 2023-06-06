const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
});
module.exports = router;
