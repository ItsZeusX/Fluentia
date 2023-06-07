const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

//Routes
const missionsRoute = require("./routes/missions");
const lessonsRoute = require("./routes/lessons");
const activities = require("./routes/activities");

const login = require("./routes/login");
const register = require("./routes/register");
const logout = require("./routes/logout");

const score = require("./routes/score");
const passed = require("./routes/passed");
const grade = require("./routes/grade");

const profile = require("./routes/profile");
const profilePic = require("./routes/profilePic");
const changeProfilePic = require("./routes/changeProfilePic");

const search = require("./routes/search");

const authenticateToken = require("./middleware/authenticateToken");
const fileUpload = require("express-fileupload");
require("dotenv").config();

// Connect to database
// mongoose.connect("mongodb://127.0.0.1:27017/Altissia");
mongoose.connect(
  "mongodb+srv://root:root@discordcharacters.3lpftwj.mongodb.net/Fluentia?retryWrites=true&w=majority"
);
//App
const app = express();
//Proxy
app.use(
  "/data",
  createProxyMiddleware({
    target: "https://app.ofppt-langues.ma",
    changeOrigin: true,
  })
);
//Misc
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(fileUpload());
app.use(cookieParser());

//API Routes
app.use("/api/missions", missionsRoute);
app.use("/api/lessons", lessonsRoute);
app.use("/api/activities", activities);
app.use("/api/score", score);
app.use("/api/passed", passed);
app.use("/api/grade", grade);
app.use("/api/profile", profile);
app.use("/api/profilePic", profilePic);
app.use("/api/changeProfilePic", changeProfilePic);
app.use("/api/search", search);

//Auth Routes
app.use("/auth/login", login);
app.use("/auth/register", register);
app.use("/auth/logout", logout);

//Pages
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "app.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "app.html"));
});
app.get("*", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "app.html"));
});
let PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server started on port localhost:"+PORT);
});
