const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationCategory",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    description: { type: String },

    quantity: { type: Number, default: 1 },

    photos: [{ type: String }], // image URLs

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },

    pickupMethod: {
      type: String,
      enum: ["pickup", "dropoff"],
      default: "pickup",
    },
    dropOffPantry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pantry",
      default: null,
    },
    pickupAssignedPantry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pantry",
      default: null,
    },
    matchedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "assigned",
        "collected",
        "delivered",
        "rejected",
        "completed",
      ],
      default: "pending",
    },

    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

DonationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donation", DonationSchema);
