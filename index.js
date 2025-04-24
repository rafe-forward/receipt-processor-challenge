const express = require("express");

const app = express();

//port for application
const port = 3000;

const receiptsRoutes = require("./routes/receipts");
const connectionRoutes = require("./routes/connection");
// Enables server to parse incoming requests with JSON
// Makes it available in body
app.use(express.json());

// use receipts route
app.use("/receipts",receiptsRoutes);
app.use("/connection", connectionRoutes);
// Starts the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });