const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

/**
 * protect - middleware that verifies JWT and attaches user to req.user
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error", err);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

/**
 * authorize - role-based guard, usage: authorize('admin', 'driver')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Not authorized" });
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, authorize };
