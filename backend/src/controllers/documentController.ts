import { Request, Response } from "express";
import { PDFParse } from "pdf-parse";
import mongoose from "mongoose";

import Chat from "../models/Chat.js";
import DocumentModel from "../models/Document.js";
import Chunk from "../models/Chunk.js";

import chunkText from "../utils/chunkText.js";
import generateEmbedding from "../utils/generateEmbedding.js";

export const uploadDocument = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload a PDF file",
        });
    }

    let parser: PDFParse | undefined;

    let createdChatId: string | null = null;
    let createdDocumentId: string | null = null;

    // extract PDR TeXT  
    try {

        parser = new PDFParse({
            data: req.file.buffer,
        });

        const result = await parser.getText();
        const extractedText = result.text;

        if (!extractedText.trim()) {
            return res.status(400).json({
                success: false,
                message: "No readable text found in PDF",
            });
        }

        //    Create Chat 
        const chatTitle =
            req.file.originalname.replace(/\.pdf$/i, "").trim() || "New Chat";

        const chat = await Chat.create({
            userId: res.locals.userId,
            title: chatTitle,
            documentId: null,
        });

        createdChatId = chat._id.toString();


        //create Document 
        const document = await DocumentModel.create({
            userId: res.locals.userId,
            chatId: chat._id,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            extractedText,
        });

        createdDocumentId = document._id.toString();


        await Chat.findOneAndUpdate(
            {
                _id: chat._id,
                userId: res.locals.userId,
            },
            {
                documentId: document._id,
            },
            { new: true }
        );

        // create Chunks 
        const chunks = chunkText(extractedText);


        const chunkDocuments = await Promise.all(
            chunks.map(async (content, index) => {
                const embedding = await generateEmbedding(content);

                return {
                    userId: res.locals.userId,
                    documentId: document._id,
                    content,
                    chunkIndex: index,
                    embedding,
                };
            })
        );


        await Chunk.insertMany(chunkDocuments);


        return res.status(201).json({
            success: true,
            message: "PDF uploaded and chat created successfully",
            chat: {
                id: chat._id,
                title: chat.title,
            },
            document: {
                id: document._id,
                fileName: document.fileName,
                fileSize: document.fileSize,
            },
            totalChunks: chunks.length,
        });
    } catch (error) {
        console.log('error -> ', error)
        await Promise.allSettled([
            ...(createdDocumentId
                ? [
                    Chunk.deleteMany({ documentId: createdDocumentId }),
                    DocumentModel.findByIdAndDelete(createdDocumentId),
                ]
                : []),
            ...(createdChatId
                ? [Chat.findByIdAndDelete(createdChatId)]
                : []),
        ]);

        return res.status(500).json({
            success: false,
            message: "Failed to process PDF upload",
        });
    } finally {
        await parser?.destroy();
    }
};