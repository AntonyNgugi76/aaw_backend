require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB
const connectDB = require("./src/configs/db");
connectDB();

// Routes FIRST
const authRoutes = require("./src/routes/auth.route");
app.use("/api/auth", authRoutes);

//users routes 
const userRoutes = require("./src/routes/user.routes");
app.use("/api/users", userRoutes);

const donationRoutes = require("./src/routes/donation.route");
const categoryRoutes = require("./src/routes/category.route");

app.use("/api/donations", donationRoutes);
app.use("/api/categories", categoryRoutes);

const pantryRoutes = require("./src/routes/pantry.route");
app.use("/api/pantries", pantryRoutes);

const requestReoutes = require("./src/routes/request.route");
app.use("/api/requests", requestReoutes);

const uploadRoutes = require("./src/routes/upload.route");
app.use("/api/uploads", uploadRoutes);

// Base API check
app.get("/", (req, res) => {
  res.send({ message: "API is running..." });
});

// Start server LAST
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
