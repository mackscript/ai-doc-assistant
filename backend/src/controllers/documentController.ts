import { Request, Response } from "express";
import { PDFParse } from "pdf-parse";
import DocumentModel from "../models/Document.js";


export const uploadDocument = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload a PDF file",
        });
    }

    let parser: PDFParse | undefined;
    try {
        parser = new PDFParse({
            data: req.file.buffer
        })

        const result = await parser.getText()
        const extractedText = result.text;

        if (!extractedText.trim()) {
            return res.status(400).json({
                success: false,
                message: "No readable text found in PDF",
            });
        }
        const document = await DocumentModel.create({
            userId: res.locals.userId,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            extractedText,
        });

        return res.status(201).json({
            success: true,
            message: "PDF uploaded and saved successfully",
            document: {
                id: document._id,
                fileName: document.fileName,
                fileSize: document.fileSize,
            },
        });

    } catch (error) {
        console.error("PDF Extraction Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to extract PDF text",
        });
    } finally {
        await parser?.destroy();
    }
} 