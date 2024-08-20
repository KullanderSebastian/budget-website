import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import User from "@/app/models/UserSchema";
import connectToDatabase from "@/app/lib/mongodb";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const emailSender = process.env.EMAIL_SENDER;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

if (!sendgridApiKey) {
    throw new Error("SENDGRID_API_KEY is not defined the the environment variables");
}

if (!emailSender) {
    throw new Error("EMAIL_SENDER is not defined the the environment variables");
}

sgMail.setApiKey(sendgridApiKey);

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ userId: savedUser._id }, jwtSecret!, { expiresIn: "24h" });

        const verificationLink = `http://localhost:3000/auth/verification?token=${token}`;

        const msg = {
            to: email,
            from: emailSender!,
            subject: "Verify your account",
            html: `Please verify your email by clicking <a href="${verificationLink}">Here</a>`,
        };

        if (savedUser) {
            try {
                await sgMail.send(msg);
                return res.status(201).json({ message: "User created", userId: savedUser._id });
            } catch (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Failed to send verification email" });
            }
        } else {
            res.status(500).json({ message: "Failed to create user" });
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}