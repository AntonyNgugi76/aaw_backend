const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationCategory",
      required: true,
    },

    itemName: { type: String, required: true },

    description: { type: String },

    quantity: { type: Number, default: 1 },

    // destitute location (optional)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    // pantry where user will collect (optional)
    fulfillmentPantry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pantry",
      default: null,
    },
    matchedDonation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      default: null,
    },

    // Workflow status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "fulfilled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

RequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Request", RequestSchema);
