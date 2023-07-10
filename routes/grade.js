const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
router.post("/", async (req, res) => {
  try {
    let grade = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CHATGPT_API_KEY}`,
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "user",
            "content": `from now on, you will act as a teacher grading his student work, your mission will be to grade the submission of your student, 
          i will give you a task and context and then i will give you the student's submission and give some remarks or comments.

          Context: 
            ${req.body.context}
          Task : 
            ${req.body.task}
          Student submission :
            ${req.body.submission}`,
          },
        ],
      }),
    }).then((res) => res.json());
    res.json({ grade: grade.choices[0].message.content });
  } catch {
    res.json({ grade: "The AI grading is unavailable for now" });
  }
});
module.exports = router;
