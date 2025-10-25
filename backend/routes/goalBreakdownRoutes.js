import express from "express";
import { requestLimiter } from "../middleware/rateLimiter.js";
import { breakdownGoal } from "../controllers/goalBreakdownController.js";

const router = express.Router();

router.post("/", requestLimiter, breakdownGoal);

export default router;