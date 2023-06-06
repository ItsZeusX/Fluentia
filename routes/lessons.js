const express = require("express");
const Lesson = require("../schemas/Lesson");
const Activity = require("../schemas/Activity");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

//* Get Lesson Activities (without activity content)
router.get("/:lessonId", authenticateToken, async (req, res) => {
  try {
    const lesson = await Lesson.aggregate([
      {
        $match: {
          externalId: req.params.lessonId,
        },
      },
      //! -------------------------- For some reason, keeping a copy of activities keeps the right order ----------------------------------------
      {
        $addFields: {
          "sortedActivities": "$activities",
        },
      },
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: "activities",
            localField: "activities",
            foreignField: "_id",
            as: "activities",
          },
      },
      {
        $unset:
          /**
           * Provide the field name to exclude.
           * To exclude multiple fields, pass the field names in an array.
           */
          "activities.content",
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
          as: "scores",
        },
      },
      {
        $set:
          /**
           * field: The field name
           * expression: The expression.
           */
          {
            scores: {
              $arrayElemAt: ["$scores.scores", 0],
            },
          },
      },
      {
        $addFields:
          /**
           * newField: The new field name.
           * expression: The new field expression.
           */
          {
            activities: {
              $map: {
                input: "$activities",
                as: "activity",
                in: {
                  // Add or modify fields within each object
                  $mergeObjects: [
                    "$$activity",
                    {
                      score: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$scores",
                              cond: {
                                $eq: [
                                  "$$this.externalActivityId",
                                  "$$activity.externalId",
                                ],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    }, // Add your new field here
                  ],
                },
              },
            },
          },
      },
      {
        $addFields: {
          "activities": {
            $map: {
              input: "$activities",
              as: "activity",
              in: {
                $mergeObjects: [
                  "$$activity",
                  {
                    score: "$$activity.score.score",
                    status: "$$activity.score.status",
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unset:
          /**
           * Provide the field name to exclude.
           * To exclude multiple fields, pass the field names in an array.
           */
          ["scores", "sortedActivities"],
      },
    ]);

    if (lesson === null) {
      res.status(404).send("Lesson not found");
      return;
    }

    // Send the documents as a JSON response
    res.json(lesson[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
