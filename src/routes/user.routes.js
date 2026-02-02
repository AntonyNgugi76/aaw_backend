
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize('admin'),  userController.getAllUsers);

module.exports = router;