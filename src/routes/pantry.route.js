const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const pantryController = require("../controllers/pantry.controller");
const { protect, authorize } = require("../middleware/auth");

const pantryValidation = [
  body("name").notEmpty().withMessage("Pantry name is required"),
  body("coordinates")
    .isArray({ min: 2 })
    .withMessage("Coordinates are required"),
];

// Public (mobile app)
router.get("/", pantryController.getPantries);

// Admin-only
router.post(
  "/",
  protect,
  authorize("admin"),
  pantryValidation,
  pantryController.createPantry
);
router.put("/:id", protect, authorize("admin"), pantryController.updatePantry);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  pantryController.deletePantry
);

module.exports = router;
