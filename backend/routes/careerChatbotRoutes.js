import { Router } from "express";
import { careerChatbot } from "../controllers/careerChatbotController.js";
import { requestLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", requestLimiter, careerChatbot);

export default router;