import express from "express";
import { createChat, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:chatId/messages", protect, sendMessage);
router.post("/new", protect, createChat)
export default router;