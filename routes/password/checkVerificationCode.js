const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../schemas/User");
const config = require("../../config.json");

router.post("/", async (req, res) => {
  let foundUser = await User.findOne({
    email: req.body.email,
  });
  if (foundUser) {
    if (foundUser.verificationCode == req.body.code) {
      //* CHECK IF BANNED
      if (foundUser.banned === true) {
        return res.json({
          error: true,
          message: "Your account has is banned.",
        });
      }
      //* CHECK MAINTEANCE MODE
      if (config.maintenance === true) {
        if (foundUser.role !== "admin") {
          return res.json({
            error: true,
            message:
              "The platform is currently under maintenance, please try again later",
          });
        }
      }
      const accessToken = jwt.sign(
        { email: req.body.email, role: foundUser.role },
        process.env.ACCESS_TOKEN
      );
      // Set the JWT as a cookie
      //? REMOVED { httpOnly: true, secure: true } from the cookie options
      res.cookie("jwt", accessToken);

      //* SEND NOTIFICATION
      await User.updateOne(
        { email: req.body.email },
        {
          $push: {
            notifications: {
              title: "Verification Successfull",
              body: "You have successfully verified your account. Please consider changing your password as soon as possible.",
            },
          },
        }
      );
      // Send a response
      return res.json({ error: false, message: "Verification Successfull" });
    } else {
      return res.json({
        error: true,
        message: "Wrong Verification Code.",
      });
    }
  } else {
    return res.json({
      error: true,
      message: "The email you entered is not registered.",
    });
  }
});

module.exports = router;
