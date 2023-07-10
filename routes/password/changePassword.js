const express = require("express");
const router = express.Router();
const User = require("../../schemas/User");
const authenticateToken = require("../../middleware/authenticateToken");

router.post("/", authenticateToken, async (req, res) => {
  let foundUser = await User.findOne({
    email: req.user.email,
  });
  if (foundUser.password === req.body.current) {
    await User.updateOne(
      { email: req.user.email },
      {
        $set: {
          password: req.body.new,
        },
      }
    );
    return res.json({
      error: false,
      message: "Password changed successfully",
    });
  } else {
    return res.json({
      error: true,
      message: "Wrong password.",
    });
  }
});

module.exports = router;
