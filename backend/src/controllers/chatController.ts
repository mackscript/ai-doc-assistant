import { Request, Response } from "express";
import mongoose from "mongoose";

import searchSimilarChunks from "../utils/searchSimilarChunks.js";
import generateAnswer from "../utils/generateAnswer.js";

import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import DocumentModel from "../models/Document.js";
import Chunk from "../models/Chunk.js";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const { message } = req.body;
        const userId = res.locals.userId;


        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }


        if (
            typeof chatId !== "string" ||
            !mongoose.Types.ObjectId.isValid(chatId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid chat ID",
            });
        }

        const chatObjectId = new mongoose.Types.ObjectId(chatId);


        // find chat
        const chat = await Chat.findOne({
            _id: chatObjectId,
            userId,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }


        if (!chat.documentId) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF before sending messages",
            });
        }


        const document = await DocumentModel.findOne({
            _id: chat.documentId,
            chatId: chat._id,
            userId,
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Attached PDF not found",
            });
        }


        const userMessage = await Message.create({
            chatId: chatObjectId,
            userId,
            role: "user",
            content: message.trim(),
        });


        // search form  Chunks 
        const relevantChunks = await searchSimilarChunks(
            message.trim(),
            userId.toString(),
            chat.documentId.toString()
        );

        let answer: string;


        if (relevantChunks.length === 0) {
            answer =
                "I couldn't find relevant information in this PDF.";
        } else {
            const context = relevantChunks
                .map((chunk, index) => {
                    return `Source ${index + 1}:\n${chunk.content}`;
                })
                .join("\n\n");

            answer = await generateAnswer({
                question: message.trim(),
                context,
            });
        }


        const assistantMessage = await Message.create({
            chatId: chatObjectId,
            userId,
            role: "assistant",
            content: answer,
        });


        chat.updatedAt = new Date();
        await chat.save();

        return res.status(200).json({
            success: true,
            message: "Chat message processed successfully",
            data: {
                userMessage,
                assistantMessage,
                sources: relevantChunks.map((chunk) => ({
                    documentId: chunk.documentId,
                    chunkIndex: chunk.chunkIndex,
                    score: chunk.score,
                    content: chunk.content,
                })),
            },
        });
    } catch (error) {
        console.error("Chat error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process message",
        });
    }
};


export const createChat = async (_req: Request, res: Response) => {
    return res.status(400).json({
        success: false,
        message: "Please upload a PDF to create a new chat",
    });
};

export const getAllChats = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = res.locals.userId;

        const chats = await Chat.find({ userId })
            .sort({ updatedAt: -1 })
            .select("_id title documentId createdAt updatedAt");

        return res.status(200).json({
            success: true,
            message: "Chats retrieved successfully",
            data: chats,
        });
    } catch (error) {
        console.log('error :>> ', error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve chats",
        });
    }
};

export const getChatMessages = async (
    req: Request,
    res: Response
) => {
    try {
        const { chatId } = req.params;
        const userId = res.locals.userId;

        if (
            typeof chatId !== "string" ||
            !mongoose.Types.ObjectId.isValid(chatId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid chat ID",
            });
        }

        const chat = await Chat.findOne({
            _id: new mongoose.Types.ObjectId(chatId),
            userId,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        const messages = await Message.find({
            chatId: chat._id,
            userId,
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Chat history retrieved successfully",
            data: {
                chat,
                messages,
            },
        });
    } catch (error) {
        console.log('error  getChatMessages :>> ', error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve chat history",
        });
    }
};

export const deleteChat = async (
    req: Request,
    res: Response
) => {
    try {
        const { chatId } = req.params;
        const userId = res.locals.userId;

        if (
            typeof chatId !== "string" ||
            !mongoose.Types.ObjectId.isValid(chatId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid chat ID",
            });
        }

        const chat = await Chat.findOne({
            _id: new mongoose.Types.ObjectId(chatId),
            userId,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }


        const document = await DocumentModel.findOne({
            chatId: chat._id,
            userId,
        });


        await Message.deleteMany({
            chatId: chat._id,
            userId,
        });


        if (document) {
            await Chunk.deleteMany({
                documentId: document._id,
                userId,
            });

            await DocumentModel.deleteOne({
                _id: document._id,
                userId,
            });
        }


        await Chat.deleteOne({
            _id: chat._id,
            userId,
        });

        return res.status(200).json({
            success: true,
            message: "Chat and its PDF deleted successfully",
        });
    } catch (error) {
        console.log('error  Delete :>> ', error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete chat",
        });
    }
};