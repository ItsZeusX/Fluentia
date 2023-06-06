const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
const User = require("../schemas/User");
const FormData = require("form-data");
const fetch = require("node-fetch");
//* CHANGE PROFILE PICTURE
router.post("/", authenticateToken, async (req, res) => {
  try {
    url = await uploadImageToTelegraph(req.files.file.data);
    await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        $set: {
          image: url,
        },
      },
      { new: true }
    );
    // Send the documents as a JSON response
    res.json({ url: url });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

async function uploadImageToTelegraph(imageFile) {
  // Create a new form data object
  var formData = new FormData();

  // Append the image file to the form data
  formData.append("file", imageFile, {
    filename: "file.txt",
    contentType: "application/octet-stream", // Set the appropriate content type
  });

  // Set the endpoint URL
  var url = "https://telegra.ph/upload";

  // Send the request using fetch
  result = await fetch(url, {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
  return "https://telegra.ph" + result[0].src;
}
module.exports = router;
