import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/app/models/UserSchema";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export default async function resetPassword(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, jwtSecret!) as { userId: string };

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid token or user does not exist." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ success: true, message: "Password has been reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).json({ message: "Invalid or expired token." });
    }
}