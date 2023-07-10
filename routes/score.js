const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

const config = require("../config.json");

const User = require("../schemas/User");

router.post("/", authenticateToken, async (req, res) => {
  //* If the user has started this activity before, update the score
  let foundUser = await User.findOneAndUpdate(
    {
      email: req.user.email,
      "scores.externalActivityId": req.body.externalActivityId,
    },
    {
      $set: {
        "scores.$[element].score": req.body.score,
        "scores.$[element].status":
          req.body.score >= config.minimum_score_percentage
            ? "PASSED"
            : "FAILED",
      },
      $inc: {
        timeSpent: req.body.timeSpent,
      },
    },
    {
      arrayFilters: [
        { "element.externalActivityId": req.body.externalActivityId },
      ],
      new: true,
    }
  );
  //* If the user has not started this activity before, create a new score
  if (!foundUser) {
    await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        $inc: {
          gems: req.body.gems,
          timeSpent: req.body.timeSpent,
        },
        $push: {
          scores: {
            externalActivityId: req.body.externalActivityId,
            score: req.body.score,
            status:
              req.body.score >= config.minimum_score_percentage
                ? "PASSED"
                : "FAILED",
          },
        },
      },
      { new: true }
    );
  }

  res.json(foundUser);
});
module.exports = router;
