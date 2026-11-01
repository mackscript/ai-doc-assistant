
import mongoose, { Schema, Document } from "mongoose";

interface IDocument extends Document {
    userId: mongoose.Types.ObjectId;
    chatId: mongoose.Types.ObjectId;
    fileName: string;
    mimeType: string;
    fileSize: number;
    extractedText: string;
}

const documentSchema = new Schema<IDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        extractedText: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const DocumentModel = mongoose.model<IDocument>(
    "Document",
    documentSchema
);

export default DocumentModel;
