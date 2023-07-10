const config = require("../config.json");

function Maintenance(req, res, next) {
  if (
    req.path == "/login" ||
    req.path == "/register" ||
    req.user.role == "admin"
  )
    return next();
  if (config.maintenance == true) {
    res.status(503).send("Site is under maintenance");
  } else {
    next();
  }
}

module.exports = Maintenance;
