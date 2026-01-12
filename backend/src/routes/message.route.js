import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.post("/", authMiddleware, sendMessage);

router.get("/:conversationId", authMiddleware, getMessages);

router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;
