const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
const config = require("../config.json");

const User = require("../schemas/User");

router.get("/", authenticateToken, async (req, res) => {
  //* If the user has started this activity before, update the score
  let foundUser = await User.aggregate([
    { $sort: { gems: -1 } },

    {
      $project: {
        username: "$username",
        image: "$image",
        gems: "$gems",
        totalActivities: { $size: "$scores" },
        isUser: {
          $cond: {
            if: { $eq: ["$email", req.user.email] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]).limit(config.leaderboard_limit);

  res.json(foundUser);
});
module.exports = router;
