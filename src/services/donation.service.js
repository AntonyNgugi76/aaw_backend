const Donation = require("../models/Donation");
const Request = require("../models/Request");
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

const getDonationsByPantry = async (pantryId, limit, skip) => {
  const pantryDonations = await Donation.find({ dropOffPantry: pantryId })
    .populate("user category dropOffPantry pickupAssignedPantry matchedRequest")
    .limit(limit)
    .skip(skip);
  const count = await Donation.countDocuments({ dropOffPantry: pantryId });
  return {
    donations: pantryDonations,
    count,
    limit,
    skip,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(count / limit),
  };
};

const getDonationsByCategory = async (categoryId, limit, skip) => {
  const categoryDonations = await Donation.find({ category: categoryId })
    .populate("user category dropOffPantry pickupAssignedPantry matchedRequest")
    .limit(limit)
    .skip(skip);
  const count = await Donation.countDocuments({ category: categoryId });
  return {
    donations: categoryDonations,
    count,
    limit,
    skip,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(count / limit),
  };
};

const getAllDonations = async (filter = {}, limit = 20, skip = 0) => {
  const allDonations = await Donation.find(filter)
    .populate(
      "user category dropOffPantry pickupAssignedPantry matchedRequest assignedDriver"
    )
    .limit(limit)
    .skip(skip);
  const count = await Donation.countDocuments(filter);
  return {
    donations: allDonations,
    count,
    limit,
    skip,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(count / limit),
  };
};

const updateDonationStatus = async (donationId, status) => {
  return Donation.findByIdAndUpdate(donationId, { status }, { new: true });
};

const matchDonationWithRequest = async (donationId, requestId) => {
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw new Error("Donation not found");
  }
  const request = await Request.findById(requestId);
  if (!request) {
    throw new Error("Request not found");
  }

  if (donation.status !== "approved" || request.status !== "approved") {
    throw new Error("Both donation and request must be approved to match");
  }
  donation.matchedRequest = requestId;
  donation.status = "assigned"; // update donation status
  request.matchedDonation = donationId;
  request.status = "fulfilled"; // update request status
  await donation.save();
  await request.save();

  const updatedDonation = await Donation.findById(donationId)
    .populate("user category dropOffPantry pickupAssignedPantry")
    .populate("matchedRequest");

  return updatedDonation;
};

module.exports = {
  createDonation,
  getUserDonations,
  getDonationById,
  getDonationsByPantry,
  getDonationsByCategory,
  getAllDonations,
  updateDonationStatus,
  matchDonationWithRequest,
};
