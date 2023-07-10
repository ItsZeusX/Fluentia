const express = require("express");
const fs = require("fs");
const path = require("path");

const authenticateToken = require("../../middleware/authenticateToken");

const router = express.Router();

//* PROGRESS
router.get("/", async (req, res) => {
  try {
    const configPath = path.join(__dirname, "relative", "../../../config.json");
    const configData = fs.readFileSync(configPath, "utf8");

    // Parse the JSON data into a JavaScript object
    const config = JSON.parse(configData);
    res.json(config);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
