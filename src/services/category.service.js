const DonationCategory = require("../models/DonationCategory");

const createCategory = async (data) => {
  const category = new DonationCategory(data);
  return category.save();
};

const getCategories = async () => {
  return DonationCategory.find({});
};

const updateCategory = async (id, data) => {
  return DonationCategory.findByIdAndUpdate(id, data, { new: true });
};

const deleteCategory = async (id) => {
  return DonationCategory.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
