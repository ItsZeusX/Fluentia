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
const checkVerificationCode = require("./routes/password/checkVerificationCode");
const forgotPassword = require("./routes/password/forgotPassword");
const changePassword = require("./routes/password/changePassword");

const score = require("./routes/score");
const passed = require("./routes/passed");
const grade = require("./routes/grade");
const leaderboard = require("./routes/leaderboard");

const profile = require("./routes/profile");
const userData = require("./routes/userData");
const changeProfilePic = require("./routes/changeProfilePic");
const notifications = require("./routes/notifications");
const deleteNotification = require("./routes/deleteNotification");

//ADMIN
const disable = require("./routes/admin/disable");
const enable = require("./routes/admin/enable");
const disabled = require("./routes/admin/disabled");
const editConfig = require("./routes/admin/editConfig");
const getConfig = require("./routes/admin/getConfig");
const users = require("./routes/admin/users");
const ban = require("./routes/admin/ban");
const unban = require("./routes/admin/unban");
const resetpassword = require("./routes/admin/resetpassword");
const notify = require("./routes/admin/notify");
const createaccount = require("./routes/admin/createAccount");
const accountsfromcsv = require("./routes/admin/accountsFromCSV");

//SEARCH
const search = require("./routes/search");

//Middleware
const authenticateToken = require("./middleware/authenticateToken");
const Maintenance = require("./middleware/checkIfMaintenance");

const fileUpload = require("express-fileupload");
require("dotenv").config({ path: "../.env" });

// Connect to database
// mongoose.connect("mongodb://127.0.0.1:27017/Altissia");
mongoose.connect(
  "mongodb+srv://itszeusx:f38997a3d1@fluentia.ikwx99l.mongodb.net/fluentia?retryWrites=true&w=majority"
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
app.use("/api/user", userData);
app.use("/api/changeProfilePic", changeProfilePic);
app.use("/api/notifications", notifications);
app.use("/api/deleteNotification", deleteNotification);
app.use("/api/leaderboard", leaderboard);
app.use("/api/search", search);

//ADMIN
app.use("/api/admin/disable", disable);
app.use("/api/admin/enable", enable);
app.use("/api/admin/disabled", disabled);
app.use("/api/admin/editconfig", editConfig);
app.use("/api/admin/config", getConfig);
app.use("/api/admin/users", users);
app.use("/api/admin/ban", ban);
app.use("/api/admin/unban", unban);
app.use("/api/admin/resetpassword", resetpassword);
app.use("/api/admin/notify", notify);
app.use("/api/admin/createaccount", createaccount);
app.use("/api/admin/accountsfromcsv", accountsfromcsv);

//Auth Routes
app.use("/auth/login", login);
app.use("/auth/register", register);
app.use("/auth/logout", logout);
app.use("/auth/verifycode", checkVerificationCode);
app.use("/auth/forgotPassword", forgotPassword);
app.use("/auth/changePassword", changePassword);

//Pages
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "app.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "app.html"));
});
app.get("*", [authenticateToken, Maintenance], (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "app.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port localhost:5000");
});
