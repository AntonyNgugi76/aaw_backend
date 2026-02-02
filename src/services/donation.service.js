const Donation = require("../models/Donation");
const pantryService = require("../services/pantry.service"); // <-- add this

const createDonation = async (data) => {
  // If dropoff, user selects pantry
  if (data.pickupMethod === "dropoff") {
    data.dropOffPantry = data.dropOffPantry; // from controller
  }

  // If pickup, system assigns nearest pantry
  if (data.pickupMethod === "pickup") {
    const nearestPantry = await pantryService.findNearestPantry(
      data.location.coordinates
    );

    if (nearestPantry) {
      data.pickupAssignedPantry = nearestPantry._id;
    }
  }

  const donation = new Donation(data);
  await donation.save();
  return donation;
};

const getUserDonations = async (userId) => {
  return Donation.find({ user: userId })
    .populate("category")
    .populate("dropOffPantry")
    .populate("pickupAssignedPantry");
};

const getDonationById = async (id) => {
  return Donation.findById(id)
    .populate("category")
    .populate("dropOffPantry")
    .populate("pickupAssignedPantry");
};

const getDonationsByPantry = async (pantryId) => {
  return Donation.find({ dropOffPantry: pantryId }).populate(
    "user category dropOffPantry pickupAssignedPantry"
  );
};

const getDonationsByCategory = async (categoryId) => {
  return Donation.find({ category: categoryId }).populate(
    "user category dropOffPantry pickupAssignedPantry"
  );
};

const getAllDonations = async (filter = {}) => {
  return Donation.find(filter)
    .populate("user category dropOffPantry pickupAssignedPantry assignedDriver");
};

module.exports = {
  createDonation,
  getUserDonations,
  getDonationById,
  getDonationsByPantry,
  getDonationsByCategory,
  getAllDonations,
};
