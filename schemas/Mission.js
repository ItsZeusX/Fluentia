const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  externalId: {
    type : String,
    required : true,
  },
  title: String,
  image: String,
  description: String,
  highlighted: Boolean,
  validated: Boolean,
  level: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
});

module.exports = mongoose.model('Mission', missionSchema);