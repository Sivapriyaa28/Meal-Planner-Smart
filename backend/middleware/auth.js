const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    let token = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];
    if (!token && req.cookies && req.cookies.smp_token) token = req.cookies.smp_token;
    if (!token) return res.status(401).json({ message: "Please sign in to continue." });
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = { protect };