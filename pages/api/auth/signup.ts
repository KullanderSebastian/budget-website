import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import clientPromise from "@/app/lib/mongodbAdapter";
import dotenv from "dotenv";

dotenv.config();

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const client: MongoClient = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            password: hashedPassword
        };

        const result = await usersCollection.insertOne(newUser);

        if (result.insertedId) {
            res.status(201).json({ message: "User created", userId: result.insertedId });
        } else {
            res.status(500).json({ message: "Failed to create user" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}