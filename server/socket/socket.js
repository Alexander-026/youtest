import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import express from "express";
import { getUsersByIdService } from "../service/userService.js";

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN],
    // origin: [process.env.HOST_ORIGIN, "http://192.168.178.23:5173"],
    // origin: ["http://192.168.178.23:5173"],
    methods: "GET,POST,PUT,DELETE", 
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: [process.env.HOST_ORIGIN],
    	origin: [process.env.CLIENT_ORIGIN],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  const result = await getUsersByIdService(Object.keys(userSocketMap));

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", result);

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    console.log("Online Users after disconnected", Object.keys(userSocketMap));
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
