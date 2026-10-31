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


        const userMessage = await Message.create({
            chatId: chatObjectId,
            userId,
            role: "user",
            content: message.trim(),
        });

        console.log('message :>> ', message);
        console.log('userId :>> ', userId);

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


export const getAllChats = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = res.locals.userId;

        const chats = await Chat.find({ userId })
            .sort({ updatedAt: -1 })
            .select("_id title createdAt updatedAt");

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
        console.log('error :>> ', error);
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


        await Message.deleteMany({
            chatId: chat._id,
            userId,
        });


        await Chat.deleteOne({
            _id: chat._id,
            userId,
        });

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        });

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete chat",
        });
    }
};