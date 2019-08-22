const jwt = require("jsonwebtoken");
const db = require("./db");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).send({ error: "No token provided" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET);
    const text = "SELECT * FROM users WHERE id = $1";
    const { rows } = await db.query(text, [decoded.userId]);

    if (!rows[0]) {
      return res.status(400).json({ error: "The token is expired" });
    }

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { verifyToken }