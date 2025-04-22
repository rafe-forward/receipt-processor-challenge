const express = require("express");

const app = express();
const port = 3000;

const receiptsRoutes = require("./routes/receipts");
app.use(express.json());

app.use("/receipts",receiptsRoutes);

// Starts the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });