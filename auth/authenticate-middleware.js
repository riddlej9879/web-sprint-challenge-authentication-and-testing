/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const JWT_SECRET = process.env.JWT_SECRET || "Shhh. This is a secret";
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Shall not pass!" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Shall not pass!" });
      }

      req.token = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};
