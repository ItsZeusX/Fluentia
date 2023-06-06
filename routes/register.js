const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../schemas/User");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "app.html"));
});

router.post("/", async (req, res) => {
  let foundUser = await User.findOne({
    email: req.body.email,
  });
  if (foundUser) {
    return res.json({
      error: true,
      message: "Email already exists.",
    });
  }
  let createdUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  const accessToken = jwt.sign(
    { email: createdUser.email },
    process.env.ACCESS_TOKEN
  );
  // Set the JWT as a cookie
  //? REMOVED { httpOnly: true, secure: true } from the cookie options
  res.cookie("jwt", accessToken);
  // Send a response
  res.json({ error: false, message: "User Created and logged in" });
});
module.exports = router;
