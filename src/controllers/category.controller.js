const categoryService = require("../services/category.service");
const { validationResult } = require("express-validator");

exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const category = await categoryService.createCategory({
      name: req.body.name,
      description: req.body.description,
    });

    return res.status(201).json(category);
  } catch (err) {
    console.error("Create category error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    return res.json(category);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
