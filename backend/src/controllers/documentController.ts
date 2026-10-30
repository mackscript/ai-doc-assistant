import { Request, Response } from "express";
import { PDFParse } from "pdf-parse";


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

        return res.status(200).json({
            success: true,
            message: "PDF text extracted successfully",
            data: {
                fileName: req.file.originalname,
                text: extractedText,
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