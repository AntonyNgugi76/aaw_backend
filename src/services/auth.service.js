const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async ({ name, email, phone, password, role, location }) => {
  // Check existing by email or phone
  const existingByPhone = await User.findOne({ phone });
  if (existingByPhone)
    throw { status: 400, message: "Phone already registered" };

  if (email) {
    const existingByEmail = await User.findOne({ email });
    if (existingByEmail)
      throw { status: 400, message: "Email already registered" };
  }

  const user = new User({ name, email, phone, password, role, location });
  await user.save();

  // Return user and token
  const token = generateToken({ id: user._id, role: user.role });
  // Omit password
  const userSafe = await User.findById(user._id).select("-password");
  return { user: userSafe, token };
};

const login = async ({ phoneOrEmail, password }) => {
  // allow either phone or email
  const query = /\@/.test(phoneOrEmail)
    ? { email: phoneOrEmail }
    : { phone: phoneOrEmail };
  // include password field for comparison
  const user = await User.findOne(query).select("+password");
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw { status: 401, message: "Invalid credentials" };

  const token = generateToken({ id: user._id, role: user.role });
  const userSafe = await User.findById(user._id).select("-password");
  return { user: userSafe, token };
};

module.exports = { register, login };
