const express = require("express");
const { SignUpController, SignInController, FetchAllUsers, InsertUserMessage, FetchUserMessage, UpdateUserInfo, LogoutController } = require("../api-controllers/ApiController");

const router = express.Router();

module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*", // Replace with your client URL for security
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a personal chat room for the user
    socket.on("joinRoom", ({ userId }) => {
      socket.join(userId); // Each user joins their own room using their username
      console.log(`${userId} joined their personal room.`);
    });

    // Send private message to a specific user
    socket.on("sendMessage", async ({ sender, receiver, message }) => {

      try {
        const msgData = await InsertUserMessage(sender, receiver, message);
        console.log(`Message from ${sender} to ${receiver}: ${message}`);

        // Emit the message to the receiver's personal room
        io.to(receiver).emit("receiveMessage", {
          sender,
          receiver,
          message,
          timestamp: new Date(msgData.created_at).toLocaleTimeString(),
        });
      } catch (error) {
        console.error("Error while handling sendMessage:", error);
      }
    });

    // Disconnect event
    socket.on("disconnect", (data) => {
      console.log(data);

      console.log("User disconnected:", socket.id);
    });
  });


  // REST API routes

  // Home route
  router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Chat App API" });
  });

  // User sign-up route
  router.post("/signup", async (req, res) => SignUpController(req, res));

  // User sign-in route
  router.post("/signin", async (req, res) => SignInController(req, res));

  router.get("/fetch-all-users", async (req, res) => FetchAllUsers(req, res));

  router.get("/fetch-user-message", async (req, res) => FetchUserMessage(req, res));

  router.post("/update-user", async (req, res) => UpdateUserInfo(req, res));

  router.post("/logout", async (req, res) => LogoutController(req, res));

  return router;
};
