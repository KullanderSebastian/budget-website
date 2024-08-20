import { NextApiRequest, NextApiResponse } from "next";
import User from "@/app/models/UserSchema";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
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

export default async function requestResetPassword(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: "No account with that email address exists." });
    }

    const resetToken = jwt.sign({ userId: user._id }, jwtSecret!, { expiresIn: "1h" });

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

    const msg = {
        to: email,
        from: emailSender!,
        subject: "Password reset",
        html: `
            <p>You are receiving this because you (or someone else) requested to reset your password.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetUrl}">Reset password</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ success: true, message: "Password reset email has been sent." });
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ success: false, message: "Failed to send password reset email." });
    }
}