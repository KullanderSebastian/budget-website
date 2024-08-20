import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/app/models/UserSchema";
import connectToDatabase from "@/app/lib/mongodb";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export default async function verifyEmail(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token as string, jwtSecret!) as JwtPayload;

        await connectToDatabase();

        console.log("USER ID: ", decoded.userId);

        const user = await User.findById(decoded.userId);

        console.log("USER: ", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        user.emailVerified = true;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ message: "Token has expired, please request a new verification email." })
        }
        return res.status(400).json({ message: "Invalid or expired token" });
    }
}