import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.use(authMiddleware);

router.post('/',createConversation);

router.get('/',getConversation);

export default router;