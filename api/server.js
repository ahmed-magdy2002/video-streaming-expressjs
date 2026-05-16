const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../config.env"),
});

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
console.log(process.env.PORT);
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("API Running");
});
