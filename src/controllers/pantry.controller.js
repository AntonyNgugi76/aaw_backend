const pantryService = require("../services/pantry.service");
const { validationResult } = require("express-validator");

exports.createPantry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const payload = {
      name: req.body.name,
      description: req.body.description,
      location: {
        type: "Point",
        coordinates: req.body.coordinates,
      },
      address: req.body.address,
      contactPhone: req.body.contactPhone,
    };

    const pantry = await pantryService.createPantry(payload);
    res.status(201).json(pantry);
  } catch (err) {
    console.error("Create pantry error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPantries = async (req, res) => {
  try {
    const pantries = await pantryService.getPantries();
    res.json(pantries);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePantry = async (req, res) => {
  try {
    const pantry = await pantryService.updatePantry(req.params.id, req.body);
    res.json(pantry);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePantry = async (req, res) => {
  try {
    await pantryService.deletePantry(req.params.id);
    res.json({ message: "Pantry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
