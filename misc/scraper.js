const mongoose = require("mongoose");
const Mission = require("../schemas/Mission");
const Lesson = require("../schemas/Lesson");
const Activity = require("../schemas/Activity");
const fetch = require("node-fetch");
const fs = require("fs");

missions = JSON.parse(fs.readFileSync("./missions.json"));

mongoose.connect("mongodb://127.0.0.1:27017/Altissia");
headers = {
  "cookie":
    "deviceuuid=bc7a41f0-c31d-41fb-a784-d85839a55b77; NG_TRANSLATE_LANG_KEY=%22en-GB%22",
  "x-altissia-token":
    "f5d03cd370614659318d1335fff9847af024bb3d10ff544d22e470547398ba3e",
  "x-device-uuid": "bc7a41f0-c31d-41fb-a784-d85839a55b77",
};

async function start() {
  //!Missions
  for (i = 0; i < missions.length; i++) {
    let mission = missions[i];
    let lessonsIds = [];
    //!Lessons
    for (j = 0; j < mission.lessons.length; j++) {
      let lesson = mission.lessons[j];
      let activitiesIds = [];
      let lessonURL = `https://app.ofppt-langues.ma/gw//lcapi/main/api/lc/lessons/${lesson.externalId}`;
      let lessonActivities = (
        await (
          await fetch(lessonURL, { method: "GET", headers: headers })
        ).json()
      ).activities;
      //! Activities
      for (k = 0; k < lessonActivities.length; k++) {
        let activity = lessonActivities[k];
        activity = await (
          await fetch(
            `https://app.ofppt-langues.ma/gw//lcapi/main/api/lc/lessons/${lesson.externalId}/activities/${activity.externalId}`,
            { method: "GET", headers: headers }
          )
        ).json();
        newActivity = new Activity(activity);
        activitiesIds.push(newActivity._id);
        newActivity.save();
      }
      lesson.activities = activitiesIds;
      let newLesson = new Lesson(lesson);
      lessonsIds.push(newLesson._id);
      newLesson.save();
    }
    mission.lessons = lessonsIds;
    let newMission = new Mission(mission);
    newMission.save();
  }
}

async function main() {
  // await start();
  console.log("Finished")
  // let res = await Mission.findOne({externalId : "TALK_ABOUT_TIME"})
  // console.log(res)
}
main();
