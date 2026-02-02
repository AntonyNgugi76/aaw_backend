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
      dropOffPantry: req.body.dropOffPantry,
      pickupAssignedPantry: req.body.pickupAssignedPantry,
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
    req.params.pantryId,
    parseInt(req.query.limit) || 10,
    parseInt(req.query.skip) || 0
  );
  return res.json(donations);
};

exports.getCategoryDonations = async (req, res) => {
  const donations = await donationService.getDonationsByCategory(
    req.params.categoryId,
    parseInt(req.query.limit) || 10,
    parseInt(req.query.skip) || 0
  );
  return res.json(donations);
};

exports.getAllDonations = async (req, res) => {
  try {
    const { status, limit = 20, skip = 0 } = req.query;
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
    const parsedLimit = Math.max(parseInt(limit, 10) || 20, 1);
    const parsedSkip = Math.max(parseInt(skip, 10) || 0, 0);
    const result = await donationService.getAllDonations(filter, parsedLimit, parsedSkip);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const updatedDonationStatus = await donationService.updateDonationStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json(updatedDonationStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.matchDonationWithRequest = async (req, res) => {
  try {
    const { donationId, requestId } = req.body;
    const matchedDonation = await donationService.matchDonationWithRequest(
      donationId,
      requestId
    );
    res.status(200).json(matchedDonation);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
