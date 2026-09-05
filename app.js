const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/npe_db");

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
