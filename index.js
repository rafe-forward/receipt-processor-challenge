const express = require("express");

const app = express();
const cors = require('cors');
//port for application
const port = 3000;

const receiptsRoutes = require("./src/routes/receipts");
const connectionRoutes = require("./src/routes/connection");
const userRoutes = require("./src/routes/user")
// Enables server to parse incoming requests with JSON
// Makes it available in body
app.use(express.json());

// use receipts route
app.use("/receipts",receiptsRoutes);
app.use("/connection", connectionRoutes);
app.use("/user", userRoutes);
// Starts the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });