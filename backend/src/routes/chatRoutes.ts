import express from "express";

import {
    deleteChat,
    getAllChats,
    getChatMessages,
    sendMessage,
} from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:chatId/messages", protect, sendMessage);

router.get("/", protect, getAllChats);
router.get("/:chatId", protect, getChatMessages);

router.delete("/:chatId", protect, deleteChat);

export default router;