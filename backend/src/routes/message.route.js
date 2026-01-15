import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendMessage, getMessages, deleteMessage, markMessagesAsRead } from "../controllers/message.controller.js";

router.post("/", authMiddleware, sendMessage);
router.post("/read/:conversationId", authMiddleware, markMessagesAsRead);
router.get("/:conversationId", authMiddleware, getMessages);
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;
