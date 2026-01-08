const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const categoryController = require("../controllers/category.controller");
const { protect, authorize } = require("../middleware/auth");

// validations
const categoryValidation = [
  body("name").notEmpty().withMessage("Category name is required"),
];

router.get("/", categoryController.getCategories); // public for mobile app

// Admin only routes
router.post(
  "/",
  protect,
  authorize("admin"),
  categoryValidation,
  categoryController.createCategory
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  categoryController.deleteCategory
);

module.exports = router;
