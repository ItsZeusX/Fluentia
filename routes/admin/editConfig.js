const express = require("express");
const fs = require("fs");
const path = require("path");
const cachedConfig = require("../../config.json");

const authenticateToken = require("../../middleware/authenticateToken");
const { log } = require("console");

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const configPath = path.join(__dirname, "relative", "../../../config.json");
    const configData = fs.readFileSync(configPath, "utf8");

    // Parse the JSON data into a JavaScript object
    const config = JSON.parse(configData);

    const updates = req.body.updates;

    // Iterate over each field-value pair in the updates array
    for (const update of updates) {
      const field = update.field;
      const value = update.value;

      if (!config.hasOwnProperty(field)) {
        res.json({ message: `Field '${field}' not found` });
        return;
      }

      // Get the expected type for the field
      const expectedType = typeof config[field];

      // Check if the provided value matches the expected type
      if (typeof value !== expectedType) {
        res.json({
          message: `Invalid value type for field '${field}'. Expected : '${expectedType}'`,
        });
        return;
      }

      // Modify the desired field and its value
      config[field] = value;
      cachedConfig[field] = value;
    }

    // Convert the updated JavaScript object back to JSON string
    const updatedConfigData = JSON.stringify(config, null, 2);

    // Write the modified JSON string back to the config file
    fs.writeFileSync(configPath, updatedConfigData, "utf8");
    res.json({ message: "Config Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
