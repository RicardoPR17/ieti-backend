const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    token = token.replace(/(Bearer|bearer)/i, "").trim(); // Eliminar 'Bearer' del inicio del token
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { verifyToken };
