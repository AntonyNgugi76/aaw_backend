const Request = require("../models/Request");
const pantryService = require("./pantry.service");

const createRequest = async (data) => {
  // Auto-assign nearest pantry to fulfill request
  if (!data.fulfillmentPantry && data.location) {
    const nearestPantry = await pantryService.findNearestPantry(
      data.location.coordinates
    );
    if (nearestPantry) {
      data.fulfillmentPantry = nearestPantry._id;
    }
  }

  const request = new Request(data);
  await request.save();
  return request;
};

const getUserRequests = async (userId) => {
  return Request.find({ user: userId })
    .populate("category")
    .populate("fulfillmentPantry");
};

const getAllRequests = async () => {
  return Request.find({})
    .populate("user")
    .populate("category")
    .populate("fulfillmentPantry")
    .populate("matchedDonation");
};

const updateRequestStatus = async (id, status) => {
  return Request.findByIdAndUpdate(id, { status }, { new: true });
};

module.exports = {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateRequestStatus,
};
