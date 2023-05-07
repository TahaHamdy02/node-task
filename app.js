const express = require("express");
const connectionToDatabase = require("./config/dbConnection");
const app = express();

app.use(express.json());
//Route
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
//db connection
connectionToDatabase();
// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});
