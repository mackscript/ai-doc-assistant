import { Request, Response } from "express";
import "dotenv/config";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { error } from "node:console";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

console.log('JWT_SECRET :>> ', JWT_SECRET);
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body
        const normalizedEmail = String(email).trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        const hasPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            password: hasPassword
        })

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error
        });
    }
}

export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body
        const normalizedEmail = String(email).trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error
        });
    }
}