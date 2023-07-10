const express = require("express");
const Mission = require("../schemas/Mission");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

//* Get All Missions
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Find all documents in the database
    const missions = await Mission.aggregate([
      {
        $addFields: {
          sortedLessons: "$lessons",
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "lessons",
          foreignField: "_id",
          as: "populatedLessons",
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            emailToMatch: req.user.email,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$email", "$$emailToMatch"],
                },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $set: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
      {
        $set: {
          status: {
            $cond: {
              if: {
                $in: ["$externalId", "$user.passedMissions"],
              },
              then: "PASSED",
              else: "IN_PROGRESS",
            },
          },
        },
      },
    ]);
    // Send the documents as a JSON response
    res.json(missions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

//* RETURNS ONE SINGLE MISSION
router.get("/:missionId", authenticateToken, async (req, res) => {
  try {
    // Find all documents in the database
    const missions = await Mission.find({
      "externalId": req.params.missionId,
    }).populate({
      "path": "lessons",
      "select": "-activities",
    });

    const aggregatedMission = await Mission.aggregate([
      {
        $match: {
          "externalId": req.params.missionId,
        },
      },
      {
        $addFields: {
          "sortedLessons": "$lessons",
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "lessons",
          foreignField: "_id",
          as: "populatedLessons",
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            emailToMatch: req.user.email,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$email", "$$emailToMatch"],
                },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $set: {
          passedLessons: {
            $arrayElemAt: ["$user.passedLessons", 0],
          },
        },
      },
      {
        $set: {
          populatedLessons: {
            $map: {
              input: "$populatedLessons",
              as: "lesson",
              in: {
                $mergeObjects: [
                  "$$lesson",
                  {
                    status: {
                      $cond: {
                        if: {
                          $in: ["$$lesson.externalId", "$passedLessons"],
                        },
                        then: "PASSED",
                        else: "IN_PROGRESS",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $set: {
          lessons: "$populatedLessons",
        },
      },
      {
        $set: {
          "lessons.activities": { $size: "$lessons.activities" },
        },
      },
      {
        $unset: ["user", "passedLessons", "populatedLessons", "sortedLessons"],
      },
    ]);

    if (missions.length === 0) {
      res.status(404).send("Mission not found");
      return;
    }

    // Send the documents as a JSON response
    res.json(aggregatedMission[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
