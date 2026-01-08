const Pantry = require("../models/Pantry");

const createPantry = async (data) => {
  return await Pantry.create(data);
};

const getPantries = async () => {
  return await Pantry.find({});
};

const updatePantry = async (id, data) => {
  return await Pantry.findByIdAndUpdate(id, data, { new: true });
};

const deletePantry = async (id) => {
  return await Pantry.findByIdAndDelete(id);
};

const findNearestPantry = async (coordinates) => {
  return await Pantry.findOne({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates },
        $maxDistance: 10000, // 10km radius (adjust as needed)
      },
    },
  });
};

module.exports = {
  createPantry,
  getPantries,
  updatePantry,
  deletePantry,
  findNearestPantry,
};
