

// get all users 
const User = require("../models/User");

const getAllUsers = async ({ limit, skip }) => {
    const users = await User.find().select("-password").limit(limit).skip(skip);
    const total = await User.countDocuments();
    
    return {
        users,
        total,
        limit,
        skip,
        page: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil(total / limit),
    };
};

module.exports = { getAllUsers };