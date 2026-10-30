import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    fullName: string,
    email: string,
    password: string
}

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

const User = mongoose.model<IUser>("User", userSchema)

export default User;