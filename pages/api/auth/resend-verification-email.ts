import { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import User from "@/app/models/UserSchema";
import connectToDatabase from "@/app/lib/mongodb";
import dotenv from "dotenv";

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const jwtSecret = process.env.JWT_SECRET;
const emailSender = process.env.EMAIL_SENDER;

if (!sendgridApiKey) {
    throw new Error("SENDGRID_API_KEY is not defined the the environment variables");
}

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined the the environment variables");
}

if (!emailSender) {
    throw new Error("EMAIL_SENDER is not defined the the environment variables");
}

sgMail.setApiKey(sendgridApiKey);

export default async function resendVerificationEmail(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret!, { expiresIn: "24h" });

        const verificationLink = `http://localhost:3000/auth/verification?token=${token}`;

        const msg = {
            to: email,
            from: emailSender!,
            subject: "Verify your account",
            html: `Please verify your email by clicking <a href="${verificationLink}">Here</a>`,
        };

        await sgMail.send(msg);

        return res.status(200).json({ message: "Verification email resent. Please check your inbox." });
    } catch (error) {
        console.error("Error resending verification email", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
