const express = require("express");
const authenticateToken = require("../../middleware/authenticateToken");
const sendEmail = require("../../misc/email");
const router = express.Router();

const User = require("../../schemas/User");

router.post("/", async (req, res) => {
  try {
    await User.updateMany(
      {
        role: "user",
      },
      {
        $push: {
          notifications: {
            title: req.body.title,
            body: req.body.body,
            date: Date.now(),
            link: req.body.link || null,
          },
        },
      }
    );
  } catch (error) {
    console.error(error);
    res.json({ message: error });
  }
});
module.exports = router;
