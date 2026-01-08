const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    // express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, phone, password, role, location } = req.body;
    const result = await authService.register({
      name,
      email,
      phone,
      password,
      role,
      location,
    });
    return res.status(201).json({ user: result.user, token: result.token });
  } catch (err) {
    console.error("Register error", err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { phoneOrEmail, password } = req.body;
    const result = await authService.login({ phoneOrEmail, password });
    return res.json({ user: result.user, token: result.token });
  } catch (err) {
    console.error("Login error", err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

module.exports = { register, login };
