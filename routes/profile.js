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
        $lookup: {
          from: "UniqueMissionsCount",
          localField: "externalId",
          foreignField: "externalId",
          as: "UniqueMissionsCount",
        },
      },
      {
        $lookup: {
          from: "UniqueActivitiesCount",
          localField: "externalId",
          foreignField: "externalId",
          as: "UniqueActivitiesCount",
        },
      },
      {
        $lookup: {
          from: "UniqueLessonsCount",
          localField: "field",
          foreignField: "field",
          as: "UniqueLessonsCount",
        },
      },
      {
        $project: {
          username: "$username",
          email: "$email",
          image: "$image",
          timeSpent: "$timeSpent",
          passedMissions: {
            $size: "$passedMissions",
          },
          passedLessons: {
            $size: "$passedLessons",
          },
          passedActivities: {
            $size: "$scores",
          },
          totalActivitiesCount: "$UniqueActivitiesCount",
          totalLessonsCount: "$UniqueLessonsCount",
          totalMissionsCount: "$UniqueMissionsCount",
        },
      },
      {
        $unwind: {
          path: "$totalActivitiesCount",
        },
      },
      {
        $unwind: {
          path: "$totalLessonsCount",
        },
      },
      {
        $unwind: {
          path: "$totalMissionsCount",
        },
      },
      {
        $set: {
          totalActivities: "$totalActivitiesCount.uniqueActivitiesCount",
          totalLessons: "$totalLessonsCount.uniqueLessonsCount",
          totalMissions: "$totalMissionsCount.uniqueMissionsCount",
        },
      },
      {
        $unset: [
          "_id",
          "totalActivitiesCount",
          "totalLessonsCount",
          "totalMissionsCount",
        ],
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
