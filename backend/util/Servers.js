import { Server } from "socket.io";

const connectToSockets = (server) => {
  const io = new Server(server, {
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