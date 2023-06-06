const express = require("express");
const User = require("../schemas/User");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

//* PROGRESS
router.get("/", authenticateToken, async (req, res) => {
  try {
    const foundUser = await User.aggregate([
      {
        $match: {
          email: req.user.email,
        },
      },
      {
        $project: {
          image: "$image",
        },
      },
    ]);

    // Send the documents as a JSON response
    res.json(foundUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
