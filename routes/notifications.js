const express = require("express");
const User = require("../schemas/User");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

//* PROGRESS
router.post("/", authenticateToken, async (req, res) => {
  try {
    const foundUser = await User.aggregate([
      {
        $match: {
          email: req.user.email,
        },
      },
      {
        $project: {
          notifications: "$notifications",
        },
      },
    ]);

    // Send the documents as a JSON response
    res.json(foundUser[0]);
    if (req.body.read) {
      await User.updateOne(
        { email: req.user.email },
        { $set: { "notifications.$[].read": true } }
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
