const express = require("express");
const router = express.Router();
const User = require("../../schemas/User");
const csv = require("csv-parser");
const { log } = require("console");

router.post("/", async (req, res) => {
  let createdUsersCount = 0;
  let failedUsersCount = 0;
  let rows = [];

  const readableStream = require("stream").Readable;
  const stream = new readableStream();
  stream.push(req.files.file.data);
  stream.push(null);

  stream
    .pipe(csv())
    .on("data", (row) => {
      const { username, email, password } = row;
      if (username && email && password) {
        rows.push({ username, email, password });
      } else {
        //pass
      }
    })
    .on("end", async () => {
      for (let row of rows) {
        if (!row.username || !row.email || !row.password) {
          continue;
        }
        let foundUser = await User.findOne({
          email: row.email,
        });
        if (foundUser) {
          failedUsersCount++;
          continue;
        } else {
          await User.create({
            username: row.username,
            email: row.email,
            password: row.password,
          });
          createdUsersCount++;
        }
      }
      res.json({
        error: false,
        message: `Created ${createdUsersCount} Users And Skipped ${failedUsersCount} Users.`,
        createdUsersCount,
        failedUsersCount,
      });
    });
});

module.exports = router;
