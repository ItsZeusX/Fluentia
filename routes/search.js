const express = require("express");
const Mission = require("../schemas/Mission");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const config = require("../config.json");

//* Get Lesson Activities (without activity content)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const searchResults = await Mission.aggregate([
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
            from: "lessons",
            localField: "lessons",
            foreignField: "_id",
            as: "lessons",
          },
      },
      {
        $match: {
          "lessons.title": {
            $regex: new RegExp(`^${req.query.q}`, "i"),
          },
        },
      },
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: "$lessons.externalId",
            missionId: {
              $first: "$externalId",
            },
            titles: {
              $first: "$lessons.title",
            },
          },
      },
      {
        $set:
          /**
           * field: The field name
           * expression: The expression.
           */
          {
            lessonsIds: "$_id",
          },
      },
      {
        $addFields:
          /**
           * newField: The new field name.
           * expression: The new field expression.
           */
          {
            combined: {
              $zip: {
                inputs: ["$lessonsIds", "$titles"],
              },
            },
          },
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          "$combined",
      },
      {
        $addFields:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            lessonId: {
              $arrayElemAt: ["$combined", 0],
            },
            title: {
              $arrayElemAt: ["$combined", 1],
            },
          },
      },
      {
        $unset:
          /**
           * Provide the field name to exclude.
           * To exclude multiple fields, pass the field names in an array.
           */
          ["_id", "lessonsIds", "titles", "combined"],
      },
      {
        $match: {
          "title": {
            $regex: new RegExp(`^${req.query.q}`, "i"),
          },
        },
      },
      {
        $group: {
          _id: "$title",
          missionId: { $first: "$missionId" },
          lessonId: { $first: "$lessonId" },
        },
      },
      { $set: { title: "$_id" } },
      { $unset: "_id" },
    ]).limit(config.search_limit);

    if (searchResults === null) {
      res.status(404).send("Lesson not found");
      return;
    }

    // Send the documents as a JSON response
    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
