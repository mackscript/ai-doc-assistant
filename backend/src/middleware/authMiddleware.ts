import 'dotenv/config'
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET



if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        const token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        const decode = jwt.verify(token, JWT_SECRET)


        if (typeof decode === "string" || !decode.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }


        const user = await User.findById(decode.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again.",
            });
        }

        res.locals.userId = decode.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }

}