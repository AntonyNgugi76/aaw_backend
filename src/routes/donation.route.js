const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const donationController = require("../controllers/donation.controller");
const { protect } = require("../middleware/auth");

const donationValidation = [
  body("category").notEmpty().withMessage("Category is required"),
  body("itemName").notEmpty().withMessage("Item name is required"),
  // body("coordinates").isArray({ min: 2 }).withMessage("Coordinates required"),
];

router.post(
  "/",
  protect,
  donationValidation,
  donationController.createDonation
);
router.get("/mine", protect, donationController.getMyDonations);

router.get(
  "/pantries/:pantryId/donations",
  protect,
  donationController.getPantryDonations
);
router.get(
  "/donation-categories/:categoryId/donations",
  protect,
  donationController.getCategoryDonations
);

module.exports = router;
