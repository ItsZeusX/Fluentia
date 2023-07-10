const express = require("express");
const authenticateToken = require("../../middleware/authenticateToken");
const sendEmail = require("../../misc/email");
const router = express.Router();

const User = require("../../schemas/User");

router.post("/", async (req, res) => {
  try {
    let newPassword = Math.random().toString(36).substr(2, 9);

    sendEmail(
      req.body.email,
      "Password Reset Notification",
      `We are writing to inform you that your password for your Fluentia account has been reset. Your new temporary password is: ${newPassword}
      To regain access to your account, please visit the Fluentia website and log in using the temporary password provided.
      Once you have successfully logged in, we strongly recommend that you change your password to something more secure and unique.`
    );
    await User.updateOne(
      { email: req.body.email },
      { password: newPassword, passwordReseted: true }
    );
    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.json({ message: error });
  }
});
module.exports = router;
