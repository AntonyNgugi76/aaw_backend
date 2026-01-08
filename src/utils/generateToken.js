const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
