import { Server } from "socket.io";

let io;

const connectToSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);
  });
  return io;
};

export { connectToSockets };

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
};