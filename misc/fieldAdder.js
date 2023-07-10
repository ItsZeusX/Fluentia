const Activity = require('../schemas/Activity');

Activity.updateMany({}, { $set: { "": false } }, { new: true })