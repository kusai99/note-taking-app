const jwt = require("jsonwebtoken");

//middleware auth for jwt token authorization
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token is missing.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token.");
    }
    req.user = decoded;
    next();
  });
};
