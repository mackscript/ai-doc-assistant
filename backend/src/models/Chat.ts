import mongoose, { Document, Schema } from "mongoose";


interface IChat extends Document {
    userId: Schema.Types.ObjectId,
    title: string
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    }
},
    {
        timestamps: true
    }
)

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;