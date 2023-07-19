const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader == undefined) {
    res.status(401).send({ error: "No jwt token" });
  }
  let token = authHeader.split(" ")[1];
  jwt.verify(token, "secret", function (err, decoded) {
    if (err) {
      res.status(500).send({ error: "Authentication Failed" });
    } else {
      next();
    }
  });
}

module.exports = verifyToken;
