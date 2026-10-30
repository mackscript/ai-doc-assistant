import mongoose, { Schema, Document } from "mongoose";

interface IChunk extends Document {
    userId: mongoose.Types.ObjectId;
    documentId: mongoose.Types.ObjectId;
    content: string;
    chunkIndex: number;
}

const chunkSchema = new Schema<IChunk>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        documentId: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        chunkIndex: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Chunk = mongoose.model<IChunk>("Chunk", chunkSchema);

export default Chunk;