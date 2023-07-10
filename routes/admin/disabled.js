const express = require("express");
const Mission = require("../../schemas/Mission");
const authenticateToken = require("../../middleware/authenticateToken");

const router = express.Router();

//* Get All Missions
router.get("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    // Find all documents in the database
    const data = await Mission.aggregate([
      { $limit: 1 },
      {
        $group: {
          _id: null,
          temp: { $push: "$$ROOT" }, // Store all documents in the 'results' field as an array
        },
      },
      { $unset: "temp" },
      {
        $lookup: {
          from: "missions",
          let: { localField: "$localField" },
          pipeline: [
            {
              $match: {
                disabled: true, // Condition on the foreign collection
              },
            },
          ],
          as: "missions",
        },
      },
      {
        $lookup: {
          from: "lessons",
          let: { localField: "$localField" },
          pipeline: [
            {
              $match: {
                disabled: true, // Condition on the foreign collection
              },
            },
          ],
          as: "lessons",
        },
      },
      {
        $lookup: {
          from: "activities",
          let: { localField: "$localField" },
          pipeline: [
            {
              $match: {
                disabled: true, // Condition on the foreign collection
              },
            },
          ],
          as: "activities",
        },
      },
      {
        $unset: "_id",
      },
    ]);
    // Send the documents as a JSON response
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
