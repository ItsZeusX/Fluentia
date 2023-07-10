const express = require("express");
const authenticateToken = require("../../middleware/authenticateToken");

const router = express.Router();

const Lesson = require("../../schemas/Lesson");
const Mission = require("../../schemas/Mission");
const Activity = require("../../schemas/Activity");

router.post("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { type, externalId } = req.body;
  if (!type || !externalId) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  let model;
  switch (type) {
    case "lesson":
      model = Lesson;
      break;
    case "mission":
      model = Mission;
      break;
    case "activity":
      model = Activity;
      break;
    default:
      return res.status(400).json({ message: "Invalid type" });
  }
  await model.updateOne({ externalId: externalId }, { disabled: true });
  res.json({ message: "success" });
});
module.exports = router;
