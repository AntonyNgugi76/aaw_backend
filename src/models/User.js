const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // hashed
    role: {
      type: String,
      enum: ["donor", "destitute", "admin", "driver"],
      default: "donor",
    },
    // GeoJSON point for location (latitude/longitude)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", UserSchema);
