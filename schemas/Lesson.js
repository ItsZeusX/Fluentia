const mongoose = require("mongoose");

// Define the Mission schema
const lessonSchema = new mongoose.Schema({
  externalId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["NOT_STARTED", "IN_PROGRESS", "VALIDATED"],
  },
  title: String,
  description: String,
  language: String,
  level: String,
  type: String,
  highlighted: Boolean,
  image: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

// Export the schemas
module.exports = mongoose.model("Lesson", lessonSchema);
