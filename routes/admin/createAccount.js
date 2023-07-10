const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../../schemas/User");

router.post("/", async (req, res) => {
  let foundUser = await User.findOne({
    email: req.body.email,
  });
  if (foundUser) {
    return res.json({
      error: true,
      message: "This Email Already Exists ✘",
    });
  }
  await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  // Send a response
  res.json({ error: false, message: "Account Created Successfully ✓" });
});
module.exports = router;
