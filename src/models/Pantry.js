const mongoose = require("mongoose");

const PantrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },

    address: { type: String },
    contactPhone: { type: String },
  },
  { timestamps: true }
);

PantrySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Pantry", PantrySchema);
