const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const requestController = require("../controllers/request.controller");
const { protect, authorize } = require("../middleware/auth");

const requestValidation = [
  body("category").notEmpty().withMessage("Category is required"),
  body("itemName").notEmpty().withMessage("Item name required"),
];

// Create request (destitute only)
router.post(
  "/",
  protect,
  authorize("destitute"),
  requestValidation,
  requestController.createRequest
);

// My requests
router.get(
  "/mine",
  protect,
  authorize("destitute"),
  requestController.getMyRequests
);

// Admin: get all requests
router.get("/", protect, authorize("admin"), requestController.getAllRequests);

// Admin: update request status
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  requestController.updateStatus
);

module.exports = router;
