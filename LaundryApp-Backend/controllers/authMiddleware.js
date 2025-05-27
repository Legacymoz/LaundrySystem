const jwt = require("jsonwebtoken");

// Protect routes
const protect = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token:", token); // Log the token for debugging
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only access
const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.roles.includes("admin")) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { protect, adminOnly };
