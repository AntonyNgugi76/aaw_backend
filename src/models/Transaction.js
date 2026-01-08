const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // donor who paid
    donation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" }, // if created donation record
    amount: { type: Number, required: true },
    provider: {
      type: String,
      enum: ["mpesa", "manual", "other"],
      default: "mpesa",
    },
    mpesaCheckoutRequestId: { type: String }, // Daraja checkout id
    mpesaResponse: { type: Object }, // store webhook payload (careful re: size)
    status: {
      type: String,
      enum: ["initiated", "successful", "failed", "pending"],
      default: "initiated",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
