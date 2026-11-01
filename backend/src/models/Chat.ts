import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    documentId: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        documentId: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;