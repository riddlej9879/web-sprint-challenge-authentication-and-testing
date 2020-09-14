/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Shhh. This is a secret";

module.exports = (req, res, next) => {
  console.log(req.body);
  try {
    const token = req.body.token;
    if (!token) {
      console.log("No token");
      return res.status(401).json({ you: "Shall not pass!" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Verify");
        return res.status(401).json({ you: "Shall not pass!" });
      }
    });
    req.token = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
