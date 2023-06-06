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
    password: req.body.password,
  });
  if (!foundUser) {
    return res.json({
      error: true,
      message: "Email or password is incorrect",
    });
  }
  const accessToken = jwt.sign(
    { email: req.body.email },
    process.env.ACCESS_TOKEN
  );
  // Set the JWT as a cookie
  //? REMOVED { httpOnly: true, secure: true } from the cookie options
  res.cookie("jwt", accessToken);
  // Send a response
  res.json({ error: false, message: "Login successful" });
});
module.exports = router;
