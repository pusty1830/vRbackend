require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const cors = require("cors");

const connectDB = require("./config/db.config");
const coinRoutes = require("./routes/coinRoutes");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const fetchAndStore = require("./corn/fetchAndStore");

const app = express();

// DB Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", coinRoutes);

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

// Cron Job (every hour)
cron.schedule("0 * * * *", fetchAndStore);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
