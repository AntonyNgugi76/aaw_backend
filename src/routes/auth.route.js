const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Registration validation
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("role")
    .optional()
    .isIn(["donor", "destitute", "admin", "driver"])
    .withMessage("Invalid role"),
];

// Login validation
const loginValidation = [
  body("phoneOrEmail").trim().notEmpty().withMessage("Phone or email required"),
  body("password").notEmpty().withMessage("Password required"),
];

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);

module.exports = router;
