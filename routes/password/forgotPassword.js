const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../schemas/User");
const email = require("../../misc/email");

router.post("/", async (req, res) => {
  let foundUser = await User.findOne({
    email: req.body.email,
  });
  if (foundUser) {
    let verificationCode = generateRandomString(6);
    await User.updateOne(
      {
        email: req.body.email,
      },
      {
        verificationCode: verificationCode,
      }
    );
    email(
      req.body.email,
      "Password Reset",
      "Your Verification Code is: " + verificationCode
    );
    return res.json({
      error: false,
      message: "Verification Code Sent To Your Email.",
    });
  } else {
    return res.json({
      error: true,
      message: "This Email Does Not Exist.",
    });
  }
});

function generateRandomString(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
module.exports = router;
