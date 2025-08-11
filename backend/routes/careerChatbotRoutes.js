import { Router } from "express";
import { careerChatbot } from "../controllers/careerChatbotController.js";

const router = Router();

router.post("/", careerChatbot);

export default router;