const express = require("express");
const User = require("../../schemas/User");
const authenticateToken = require("../../middleware/authenticateToken");

const router = express.Router();

//* Get All Missions
router.post("/", async (req, res) => {
  try {
    if (req.body.filter === "username") {
      const data = await User.aggregate([
        {
          $match: {
            username: { $regex: req.body.query, $options: "i" },
          },
        },
        {
          $project: {
            username: "$username",
            email: "$email",
            image: "$image",
            passwordReseted: "$passwordReseted",
          },
        },
        {
          $unset: "_id",
        },
        {
          $limit: 10,
        },
      ]);
      // Send the documents as a JSON response
      res.json(data);
    } else if (req.body.filter === "email") {
      const data = await User.aggregate([
        {
          $match: {
            email: { $regex: req.body.query, $options: "i" },
          },
        },
        {
          $project: {
            username: "$username",
            email: "$email",
            image: "$image",
            banned: "$banned",
            passwordReseted: "$passwordReseted",
          },
        },
        {
          $unset: "_id",
        },
        {
          $limit: 10,
        },
      ]);
      // Send the documents as a JSON response
      res.json(data);
    } else {
      res.json({ message: "Invalid filter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
