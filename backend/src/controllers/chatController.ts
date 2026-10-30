import { Request, Response } from "express";
import searchSimilarChunks from "../utils/searchSimilarChunks.js";
import generateAnswer from "../utils/generateAnswer.js";

export const sendMessage = async (
    req: Request,
    res: Response
) => {
    try {
        const { message } = req.body;
        const userId = res.locals.userId;


        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }


        const relevantChunks = await searchSimilarChunks(
            message.trim(),
            userId
        );


        if (relevantChunks.length === 0) {
            return res.status(200).json({
                success: true,
                answer: "I couldn't find relevant information in your uploaded documents.",
                sources: [],
            });
        }

        const context = relevantChunks
            .map((chunk, index) => {
                return `Source ${index + 1}:\n${chunk.content}`;
            })
            .join("\n\n");


        const answer = await generateAnswer({
            question: message.trim(),
            context,
        });

        return res.status(200).json({
            success: true,
            answer,
            message: "Relevant chunks retrieved successfully",
            sources: relevantChunks.map((chunk) => ({
                documentId: chunk.documentId,
                chunkIndex: chunk.chunkIndex,
                score: chunk.score,
                content: chunk.content,
            })),
        });

    } catch (error) {
        console.error("Chat error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process message",
        });
    }
};