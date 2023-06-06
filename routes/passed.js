const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

const User = require("../schemas/User");

router.post("/", authenticateToken, async (req, res) => {
  //* Add lesson to passedLessons array
  if (req.body.type === "lesson") {
    await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        $addToSet: {
          passedLessons: req.body.externalId,
        },
      },
      { new: true }
    );
  } else {
    await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        $addToSet: {
          passedMissions: req.body.externalId,
        },
      },
      { new: true }
    );
  }
  res.json({ message: "success" });
});
module.exports = router;
