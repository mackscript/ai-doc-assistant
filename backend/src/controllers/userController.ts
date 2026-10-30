import { Request, Response } from "express";
import User from "../models/User.js";

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(res.locals.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};