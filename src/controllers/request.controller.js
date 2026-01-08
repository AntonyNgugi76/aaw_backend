const requestService = require("../services/request.service");
const { validationResult } = require("express-validator");

exports.createRequest = async (req, res) => {
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
      location: req.body.coordinates
        ? { type: "Point", coordinates: req.body.coordinates }
        : undefined,
      fulfillmentPantry: req.body.fulfillmentPantry,
    };

    const request = await requestService.createRequest(data);
    return res.status(201).json(request);
  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await requestService.getUserRequests(req.user._id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await requestService.getAllRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await requestService.updateRequestStatus(
      req.params.id,
      req.body.status
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
