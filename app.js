const dotenv = require("dotenv");
const express = require("express");
const http = require("http"); // Required for Socket.IO
const cors = require("cors");

dotenv.config({ path: "./.env" });

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// HTTP Server for both Express and Socket.IO
const server = http.createServer(app);

// Import and use router
app.use(require("./router/route")(server)); // Pass the server instance to the router

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
