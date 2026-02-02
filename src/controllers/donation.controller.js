const donationService = require("../services/donation.service");
const { validationResult } = require("express-validator");

exports.createDonation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const data = {
      user: req.user._id,
      category: req.body.category,
      itemName: req.body.itemName,
      description: req.body.description,
      quantity: req.body.quantity,
      photos: req.body.photos,
      location: {
        type: "Point",
        coordinates: req.body.location.coordinates, // [lng, lat]
      },
      pickupMethod: req.body.pickupMethod,
    };

    const donation = await donationService.createDonation(data);
    return res.status(201).json(donation);
  } catch (err) {
    console.error("Create donation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getMyDonations = async (req, res) => {
  try {
    const donations = await donationService.getUserDonations(req.user._id);
    return res.json(donations);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getPantryDonations = async (req, res) => {
  const donations = await donationService.getDonationsByPantry(
    req.params.pantryId
  );
  return res.json(donations);
};

exports.getCategoryDonations = async (req, res) => {
  const donations = await donationService.getDonationsByCategory(
    req.params.categoryId
  );
  return res.json(donations);
};

exports.getAllDonations = async (req, res) => {
  try {
    const { status } = req.query;
    const allowedStatuses = [
      "pending",
      "approved",
      "assigned",
      "collected",
      "delivered",
      "rejected",
      "completed",
    ];
    let filter = {};
    if (status && allowedStatuses.includes(status)) {
      filter.status = status;
    }
    const donations = await donationService.getAllDonations(filter);
    return res.json(donations);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
