const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt; // Bearer TOKEN
  if (token == null) return res.redirect("/login");
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;

    next();
  });
}

module.exports = authenticateToken;
