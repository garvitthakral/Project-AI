import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import careerChatbotRoutes from "./routes/careerChatbotRoutes.js";
import analyzeResume from "./routes/resumeAnalyzerRutes.js";
import readmeRoutes from "./routes/readmeRoutes.js";
import { connectToSockets } from "./util/Servers.js";
import goalBreakdownRoutes from "./routes/goalBreakdownRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
connectToSockets(server);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/career-chatbot", careerChatbotRoutes);
app.use("/api/resume-analyzer", analyzeResume);
app.use("/api/readme-generator", readmeRoutes);
app.use("/api/goal-breakdown", goalBreakdownRoutes);

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
