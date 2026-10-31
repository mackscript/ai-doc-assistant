import { Request, Response } from "express";
import searchSimilarChunks from "../utils/searchSimilarChunks.js";
import generateAnswer from "../utils/generateAnswer.js";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";
import Message from "../models/Message.js";

export const sendMessage = async (
    req: Request,
    res: Response
) => {
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

        // save user message 
        const userMessage = await Message.create({
            chatId: chatObjectId,
            userId,
            role: "user",
            content: message.trim(),
        });

        // Search Relevant chunks form Documents  
        const relevantChunks = await searchSimilarChunks(
            message.trim(),
            userId
        );


        let answer: string;

        //  generateAnswer from aI 
        if (relevantChunks.length === 0) {
            answer =
                "I couldn't find relevant information in your uploaded documents.";
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


        // save assistantMessage 
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


export const createChat = async (req: Request, res: Response) => {

    try {

        const { title } = req.body
        const userId = res.locals.userId;
        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Chat title is required",
            })
        }

        const chat = await Chat.create({
            userId,
            title: title.trim(),
        })

        return res.status(200).json({
            success: true,
            message: "Chat created successfully",
            data: chat
        })


    } catch (error) {
        return res.status(500).json({
            success: true,
            message: "Failed to create chat",
        })
    }



}
