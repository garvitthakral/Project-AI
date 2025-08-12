import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import careerChatbotRoutes from "./routes/careerChatbotRoutes.js";
import analyzeResume from "./routes/resumeAnalyzerRutes.js";

dotenv.config();
const app = express();

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

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
