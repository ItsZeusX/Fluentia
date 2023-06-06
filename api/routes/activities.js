const express = require("express");
const Activity = require("../schemas/Activity");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

//* Get Activity And It's Content
router.get("/:activityId", authenticateToken, async (req, res) => {
  try {
    // Find all documents in the database
    const activity = await Activity.aggregate([
      {
        $match: {
          externalId: req.params.activityId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "externalId",
          foreignField: "scores.externalActivityId",
          as: "users",
        },
      },
      {
        $addFields: {
          users: {
            $filter: {
              input: "$users",
              as: "user",
              cond: {
                $eq: ["$$user.email", req.user.email],
              },
            },
          },
        },
      },
      {
        $addFields: {
          userScore: {
            $arrayElemAt: [
              {
                $filter: {
                  input: {
                    $arrayElemAt: ["$users.scores", 0],
                  },
                  as: "score",
                  cond: {
                    $eq: ["$$score.externalActivityId", req.params.activityId],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          score: { $ifNull: ["$userScore.score", null] },
          status: { $ifNull: ["$userScore.status", null] },
        },
      },
      {
        $unset: ["userScore", "users"],
      },
    ]);

    if (activity === null) {
      res.status(404).send("activity not found");
      return;
    }
    // Send the documents as a JSON response
    res.json(activity[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}); //this line is important since the aggregate function returns an array

module.exports = router;
