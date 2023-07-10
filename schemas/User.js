const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  image: {
    type: String,
    default: "https://telegra.ph/file/c30073c08c76ac504df77.png",
  },
  password: String,
  role: {
    type: String,
    default: "user",
  },
  gems: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  passwordReseted: {
    type: Boolean,
    default: false,
  },
  notifications: [
    {
      id: {
        type: String,
        default: function () {
          return Date.now();
        },
      },
      title: String,
      body: String,
      link: {
        type: String,
        default: null,
      },
      date: {
        type: Date,
        default: function () {
          return Date.now();
        },
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
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
