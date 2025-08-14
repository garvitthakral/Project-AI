import express from "express";
import { requestLimiter } from "../middleware/rateLimiter.js";
import { scanRepoLocal } from "../controllers/readmeGenrator.js";

const router = express.Router();

router.post("/", requestLimiter, scanRepoLocal);

export default router;