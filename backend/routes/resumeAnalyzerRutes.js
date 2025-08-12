import { Router } from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeAnalyzerController.js";
import { requestLimiter } from "../middleware/rateLimiter.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/", requestLimiter, upload.single("resume"), analyzeResume);

export default router;