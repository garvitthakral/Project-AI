// src/socket.js
import { io } from 'socket.io-client';

const socketApi = io("http://localhost:5001", {
  withCredentials: true,
});

export default socketApi;