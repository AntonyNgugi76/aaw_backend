
// get all users
const User = require("../models/User");
const UserService = require("../services/user.service");

exports.getAllUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;
        const users = await UserService.getAllUsers({ limit, skip });
        res.status(200).json([
        users
        ]);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

