import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    role: "user" | "assistant",
    content: string
}

const messageSchema = new Schema<IMessage>({

    chatId: {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
        required: true,

    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,

    },
    content: {
        type: String,
        trim: true,
        required: true
    }
})

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;