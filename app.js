const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

dotenv.config();

const { PORT = 3000, MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const userRoutes = require("./routes/users");
const parkRoutes = require("./routes/parks");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", userRoutes);
app.use("/", parkRoutes);
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
