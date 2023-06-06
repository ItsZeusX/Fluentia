const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  image: {
    type: String,
    default: "https://telegra.ph/file/c30073c08c76ac504df77.png",
  },
  password: String,
  role: String,
  scores: [
    {
      externalActivityId: String,
      score: Number,
      status: String,
    },
  ],
  passedLessons: [String],
  passedMissions: [String],
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
