const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: {
        type: String,
        required: true,
      },
    },
    score: Number,
    status: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    activityType: {
      type: String,
      required: true,
    },
    feedback: String,
  },
  {
    strict: false, // allow additional fields
  }
);

module.exports = mongoose.model("Activity", activitySchema);
