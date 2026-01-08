const mongoose = require("mongoose");

const PickupSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // role: driver
    status: {
      type: String,
      enum: ["assigned", "enroute", "collected", "cancelled", "completed"],
      default: "assigned",
    },
    pickupWindowStart: Date,
    pickupWindowEnd: Date,
    notes: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", PickupSchema);
